import { AccountingPackage } from '../Models/AccountingPackages';
import {
    IDelegatedAccessToken
} from '../Models/Api/ClientBase';

import {
    ConnectionsClient,
    FinancialRecordsClient,
} from '../Models/Api/strongbox.client';

import {
    ConnectionRequest,
    ConnectionRequestDescriptor,
    ConnectionRequestParameters,
    FinancialImportParameters,
} from '../Models/Api/strongbox.models';

// Number of milliseconds before checking to see if window is closed
const watchAuthWindowTimeout = 500;

const loadConnectWindow = (connectionInfo: ConnectionRequestDescriptor, onOpen?: (authWindow: Window) => void): Window | undefined => {
    const height = 970;
    const width = 750;

    const windowHandle = window.open(
        connectionInfo.connectionEndpoint,
        `${connectionInfo.datasourceNameId}_${connectionInfo.id}_login_popup`,
        `left=${((document.body.clientWidth) / 2) - (width / 2)}` +
        `,top=${((document.body.clientHeight) / 2) - (height / 2)}` +
        `,width=${width},height=${height}` +
        ',location=yes,toolbar=0,status=0,menubar=0,scrollbars=0'
    );

    if (windowHandle) {
        onOpen && onOpen(windowHandle);
        windowHandle.focus && windowHandle.focus();
    }

    return windowHandle || undefined;
}

const goodResponse = (status: number): boolean => {
    return status === 200 || status === 201;
}

/*
 * Shows authorization dialog for the accounting package provided and begins a financials import.  There are 3 distinct possible outcomes.
 * For each of the outcomes, 1 and only 1 of the terminal functions (onError, onAborted, onJobCreated) will be called
 * 
 * 1. Error. Something bad happened, onError is called.
 * 2. User closed the authorization window but didn't authenticate.   onAborted
 * 3. User authorized and a connection was initiated. onJobCreated
 */

export const StartFinancialsImport = async (
    accountingPackage: AccountingPackage,
    accessToken: IDelegatedAccessToken,
    strongboxUri: string,
    orgId: string,
    onError: (msg: string, detailedMsg: string) => void,
    onJobCreated: (financialRecordId: string) => void,
    onAborted: () => void,
    isCancelled: () => boolean,
    onAuthWindowOpen?: (authWindow: Window) => void
): Promise<void> => {
    const connections = new ConnectionsClient(accessToken, strongboxUri);
    const financials = new FinancialRecordsClient(accessToken, strongboxUri);

    const response = await connections.createRequest(orgId, new ConnectionRequestParameters({ datasourceNameId: accountingPackage }));
    if (!goodResponse(response.status)) {
        const detailedError = `Unable to create request for ${accountingPackage}, response status: ${response.status}`;
        console.error(detailedError);
        onError(`An error occurred communicating with the server, please try again later`, detailedError);

        return;
    }

    var success = false;

    const connectionInfo = response.result;

    const windowHandle = loadConnectWindow(connectionInfo, onAuthWindowOpen);
    if (!windowHandle) {
        const detailedError = `Failed creating window to connect with client acccounting system ${accountingPackage}`;
        console.error(detailedError);
        onError(`An error occurred locally. Try closing your browser window and attempting later`, detailedError);

        return;
    }

    var complete = false;
    var cxnStatus: ConnectionRequest | undefined = undefined;

    do {
        const windowClosedStatus = ((windowHandle.closed) || (windowHandle.opener && windowHandle.opener.closed));

        const cxnResponse = await connections.getRequest(orgId, connectionInfo.id);
        if (cxnResponse) {
            cxnStatus = cxnResponse.result;

            if (cxnStatus && (cxnStatus.status === "Success")) {
                success = true;
            } else if (windowClosedStatus) {
                complete = true;
            } else {
                await new Promise(r => setTimeout(r, watchAuthWindowTimeout));
            }
        } else {
            await new Promise(r => setTimeout(r, watchAuthWindowTimeout));
        }
    } while (!complete && !success && !isCancelled());

    if (success) {
        const reportingDate = new Date().toISOString();

        const parameters: FinancialImportParameters = new FinancialImportParameters({
            accountingConnectionId: (cxnStatus && cxnStatus.connectionId) || '',
            reportingEndDate: reportingDate,
        })

        const importResponse = await financials.import(orgId, parameters);
        if (!goodResponse(importResponse.status)) {
            const detailedError = `Failed creating a job to import financial records for ${accountingPackage}`;
            console.error(detailedError);
            onError(`A failure occurred communicating with the server. Please try again later`, detailedError);

            return;
        }

        const importStatus = importResponse.result;

        onJobCreated(importStatus.financialRecordId);
    } else {
        onAborted();
    }
}
