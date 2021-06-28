﻿import {
    IDelegatedAccessToken
} from '../Models/Api/ClientBase';

import {
    ConnectionsClient,
    FinancialRecordsClient,
} from '../Models/Api/strongbox.client';

import {
    AccountingImportOptions,
    ConnectionDescriptor,
    ConnectionRequest,
    ConnectionRequestDescriptor,
    ConnectionRequestParameters,
    ConsumerMetadata,
    FinancialImportParameters,
    FinancialStatementImportOptions,
    PrivacyControl,
    TransactionImportOptions,
    ReceivablesAndPayablesOptions,
} from '../Models/Api/strongbox.models';

import { AccountingPackage } from '../Models/AccountingPackages';

import { TextContent } from '../Text/TextContent';

// Number of milliseconds before checking to see if window is closed
const watchAuthWindowTimeout = 500;

/**
 * ImportDayMonthYear is used to provide the last day of a financial import. The date provided should not be greater 
 * than the current date. If it is not provided, the current date is used.
 * 
 * @member {number } month - is required if mostRecentDate is provided and represents the 0 based month, 
 * i.e. January = 0 and December = 11.
 * @member {number} day is required if mostRecentDate is provided.  For convenience, if you simply want to represent 
 * the end of a month, you can pass 0 for the day. For example, if you want to collect information through the end 
 * of April 2021, you can pass 3 for the month (months are zero based recall), 0 for the day and 2021 for the year. 
 * Otherwise, this is the 1 based day of the month representing the last full day of imported information. 
 * @member {number} year - is required if mostRecentDate is provided and is simply the full year, e.g. 2021.
 * 
 * */

export type ImportDayMonthYear = {
    month: number;
    day: number;
    year: number;
}

/*
 * Options for passing to strongbox import job.
 *
 * month and year values are based on javascript Date standards, that is month is 0 based.
 */

export type LenderConnectionOptions = {
    mostRecentDate?: ImportDayMonthYear;
    financialStatementsPeriod?: FinancialStatementImportOptions;
    transactionsPeriod?: TransactionImportOptions;
    payablesPeriod?: ReceivablesAndPayablesOptions;
    receivablesPeriod?: ReceivablesAndPayablesOptions;
    anonymizeCustomersAndVendors: boolean;
    provideUserCopy: boolean;
};

/*
 * StrongboxConnectionDescriptor is used for containing parameters used in the three phases of starting a financial import
 * These are:
 * 
 * 1. Finding an existing connection for an accounting package.
 * 
 * 2. Get a connection request descriptor including an id for the connection.  This will include the URL that can be
 * invoked to connect with the accounting package.  This is done prior to actually trying to load and watch the
 * connection window so that the URL can be loaded directly in the onClick handler of the button which will invoke
 * the window.   This helps with popup blocking.
 * 
 * 3. Starting the actual import itself.
 */

export type StrongboxConnectionDescriptor = {
    accountingPackage: AccountingPackage,
    delegatedAccessToken: IDelegatedAccessToken,
    strongboxUri: string,
    orgId: string,
    existingConnectionId?: string,
    submissionId?: string,
    lenderManagedOptions?: LenderConnectionOptions,
    initiator?: string,
};

export const LoadConnectWindow = (
    connectionInfo: StrongboxConnectionDescriptor,
    cxnRequestDescriptor: ConnectionRequestDescriptor | undefined,
    onOpen?: (authWindow: Window) => void
): Window | undefined => {
    const height = 970;
    const width = 750;

    const windowHandle = window.open(
        (cxnRequestDescriptor && cxnRequestDescriptor.connectionEndpoint) || 'about:blank',
        (cxnRequestDescriptor && `${cxnRequestDescriptor.datasourceNameId}_${cxnRequestDescriptor.id}_login_popup`) || '_blank',
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
    return status === 200 || status === 201 || status === 204;
}

/*
 * Get financial connection descriptor which provides all the information necessary to show a dialog for
 * connecting to a financial package.
 *
 * Returns undefined if something bad happens.  In that case onError is called.
 * 
 * On successful result, a new StrongboxConnectionDescriptor is called containing a valid ConnectionRequestDescriptor
 */

export const StartGetFinancialsConnectionDescriptor = async (
    connectionInfo: StrongboxConnectionDescriptor,
    textContent: TextContent,
    onError: (msg: string, detailedMsg: string) => void,
): Promise<ConnectionRequestDescriptor | undefined> => {
    const connections = new ConnectionsClient(connectionInfo.delegatedAccessToken, connectionInfo.strongboxUri);

    const response = await connections.createRequest(connectionInfo.orgId, new ConnectionRequestParameters({ datasourceNameId: connectionInfo.accountingPackage }));
    if (!goodResponse(response.status)) {
        const detailedError =
            textContent.TextValueWithReplacement(
                'StartFinancialsCreateRequestDetailedError',
                {
                    placeHolder: '${accountingPackage}',
                    replacement: connectionInfo.accountingPackage,
                },
                {
                    placeHolder: '${responseStatus}',
                    replacement: response.status.toString(),
                },
            );
        onError(textContent.TextValue('StartFinancialsCreateRequestSummaryError'), detailedError);

        return undefined;
    }

    return response.result;
}

export const GetFinancialsConnectionDescriptor = async (
    connectionInfo: StrongboxConnectionDescriptor,
    onError: (msg: string, detailedMsg: string) => void,
): Promise<ConnectionRequestDescriptor | undefined> => {
    const textContent = new TextContent('en');

    return await StartGetFinancialsConnectionDescriptor(connectionInfo, textContent, onError);
}

/*
 * Returns the local date in ISO format.
*/ 
function toISOLocalDateString(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

/*
 * Shows authorization dialog for the accounting package provided and begins a financials import.  There are 3 distinct possible outcomes.
 * For each of the outcomes, 1 and only 1 of the terminal functions (onError, onAborted, onJobCreated) will be called
 * 
 * 1. Error. Something bad happened, onError is called.
 * 2. User closed the authorization window but didn't authenticate.   onAborted
 * 3. User authorized and a connection was initiated. onJobCreated
 * 
 * cxnRequestDescriptor can be undefined in the event that connectionInfo has an existing connection id.
 */

export const StartFinancialsImport = async (
    connectionInfo: StrongboxConnectionDescriptor,
    cxnRequestDescriptor: ConnectionRequestDescriptor | undefined,
    windowHandle: Window | undefined,
    onError: ((msg: string, detailedMsg: string) => void) | undefined,
    onJobCreated: ((financialRecordId: string) => void) | undefined,
    onAborted: (() => void) | undefined,
    isCancelled: () => boolean,
    textContent: TextContent,
): Promise<void> => {
    try {
        const connections = new ConnectionsClient(connectionInfo.delegatedAccessToken, connectionInfo.strongboxUri);
        const financials = new FinancialRecordsClient(connectionInfo.delegatedAccessToken, connectionInfo.strongboxUri);

        let useConnectionId = connectionInfo.existingConnectionId;

        if (!useConnectionId) {
            var success = false;

            if (!(windowHandle && cxnRequestDescriptor)) {
                if (!!onError) {
                    const detailedError =
                        textContent.TextValueWithReplacement(
                            'StartFinancialsCreateRequestDetailedError',
                            {
                                placeHolder: '${accountingPackage}',
                                replacement: connectionInfo.accountingPackage,
                            },
                            {
                                placeHolder: '${responseStatus}',
                                replacement: 'required parameter windowHandle or cxnRequestDescriptor is missing',
                            }
                        );

                    onError(textContent.TextValue('StartFinancialsCreateWindowSummaryError'), detailedError);
                }

                return;
            }

            var complete = false;
            var cxnStatus: ConnectionRequest | undefined = undefined;

            do {
                const windowClosedStatus = ((windowHandle.closed) || (windowHandle.opener && windowHandle.opener.closed));

                const cxnResponse = await connections.getRequest(connectionInfo.orgId, cxnRequestDescriptor.id);
                if (cxnResponse) {
                    cxnStatus = cxnResponse.result;

                    if ((cxnStatus) && (cxnStatus.status === "Success")) {
                        success = true;
                    } else if ((windowClosedStatus) || ((cxnStatus) && (cxnStatus.errorCode !== 'None')))  {
                        complete = true;
                    } else {
                        await new Promise(r => setTimeout(r, watchAuthWindowTimeout));
                    }
                } else {
                    await new Promise(r => setTimeout(r, watchAuthWindowTimeout));
                }
            } while (!complete && !success && !isCancelled());

            if (success) {
                useConnectionId = (cxnStatus && cxnStatus.connectionId) || '';
            } else {
                onAborted && onAborted();
                return;
            }
        }

        let reportingDate: string;

        if (connectionInfo.lenderManagedOptions && connectionInfo.lenderManagedOptions.mostRecentDate) {
            let month = connectionInfo.lenderManagedOptions.mostRecentDate.month;
            let year = connectionInfo.lenderManagedOptions.mostRecentDate.year;
            // See the big comment where mostRecentDate is defined about it's actual use.  It is 1 based
            // but may be 0 to just get the full month passed in month.
            let day = connectionInfo.lenderManagedOptions.mostRecentDate.day;

            // Months are 0 based in javascript and also in the lenderManagedOptions.  
            // When you pass 0 for the day, it will get you the end
            // of the preceding month.  So, if our month is 0 (January), passing in 1 will
            // result in the date being the end of January for that year.  It is smart enough
            // to deal with an increase in date, so passing in 12 for the month will get
            // december 31 of the current year, i.e. if our month is 11 (december), passing in
            // 2021, 12, 0 will result in 2021-12-31.   

            if (day <= 0) {
                reportingDate = toISOLocalDateString(new Date(year, month + 1, 0));
            } else {
                reportingDate = toISOLocalDateString(new Date(year, month, day));
            }
        } else {
            reportingDate = toISOLocalDateString(new Date());
        }

        let metadata: ConsumerMetadata[] | undefined = undefined;

        if (connectionInfo.submissionId) {
            metadata = [];
            metadata.push(new ConsumerMetadata({
                label: 'SubmissionId',
                value: connectionInfo.submissionId,
            }));
        }

        if (connectionInfo.initiator) {
            // could still be undefined.
            if (!metadata) { 
                metadata = [];
            }
            metadata.push(new ConsumerMetadata({
                label: 'Initiator',
                value: connectionInfo.initiator,
            }));
        } 

        const parameters: FinancialImportParameters = new FinancialImportParameters({
            accountingConnectionId: useConnectionId,
            reportingEndDate: reportingDate,
            consumerMetadata: metadata,
        });

        if (connectionInfo.lenderManagedOptions) {
            let privacyControls: PrivacyControl[] = [];

            if (connectionInfo.lenderManagedOptions.anonymizeCustomersAndVendors) {
                privacyControls = ["AnonymizeContactLists", "RedactTransactionMemos"];
            }

            const {
                financialStatementsPeriod,
                transactionsPeriod,
                receivablesPeriod,
                payablesPeriod
            } = connectionInfo.lenderManagedOptions;

            // At the strongbox level, numberOfPeriods includes year to date and month to date, so
            // if you want YTD plus 1 extra FY, you would pass 2.  If you pass 0, it turns that 
            // particular piece off.

            const financialStatementOptions = new FinancialStatementImportOptions(
                financialStatementsPeriod ? {
                    reportingPeriod: financialStatementsPeriod.reportingPeriod,
                    numberOfPeriods: financialStatementsPeriod.numberOfPeriods,
                } : {
                    reportingPeriod: undefined,
                    numberOfPeriods: 0,
                }
            );
            const transactionOptions = new TransactionImportOptions(
                transactionsPeriod ? {
                    reportingPeriod: transactionsPeriod.reportingPeriod,
                    numberOfPeriods: transactionsPeriod.numberOfPeriods,
                } : {
                    reportingPeriod: undefined,
                    numberOfPeriods: 0,
                }
            );
            const receivablesOptions = new ReceivablesAndPayablesOptions(
                receivablesPeriod ? {
                    reportingPeriod: receivablesPeriod.reportingPeriod,
                    numberOfPeriods: receivablesPeriod.numberOfPeriods,
                } : {
                    reportingPeriod: undefined,
                    numberOfPeriods: 0,
                }
            );
            const payablesOptions = new ReceivablesAndPayablesOptions(
                payablesPeriod ? {
                    reportingPeriod: payablesPeriod.reportingPeriod,
                    numberOfPeriods: payablesPeriod.numberOfPeriods,
                } : {
                    reportingPeriod: undefined,
                    numberOfPeriods: 0,
                }
            );

            const importOptions = new AccountingImportOptions({
                privacyControls: privacyControls,
                financialStatements: financialStatementOptions,
                transactions: transactionOptions,
                receivables: receivablesOptions,
                payables: payablesOptions,
            })

            parameters.accountingDataImportOptions = importOptions;
        } 

        const importResponse = await financials.import(connectionInfo.orgId.toLowerCase(), parameters);

        if (!goodResponse(importResponse.status)) {
            if (!!onError) {
                const detailedError =
                    textContent.TextValueWithReplacement(
                        'StartFinancialsImportDetailedError',
                        {
                            placeHolder: '${accountingPackage}',
                            replacement: connectionInfo.accountingPackage,
                        }
                    );
                onError(textContent.TextValue('StartFinancialsImportSummaryError'), detailedError);
            }

            return;
        }

        const importStatus = importResponse.result;

        onJobCreated && onJobCreated(importStatus.financialRecordId);
    } catch (connectException) {
        onError && onError(textContent.TextValue('StartFinancialsImportSummaryError'), connectException);
    }
}

// connectionRequestId will be a value taken from a ConnectionRequestDescriptor's id property.   You get 
// one of those from callin GetFinancialsConnectionDescriptor.
//
// This is different than existingConnectionId which is an actual connection.  If this is provided the entire
// process of monitoring the connection window can be skipped and the windowHandle parameter can be undefined.
//
// cxnRequestDescriptor can be undefined in the event that connectionInfo has an existing connection id.

export const FinancialsImport = async (
    connectionInfo: StrongboxConnectionDescriptor,
    cxnRequestDescriptor: ConnectionRequestDescriptor | undefined,
    windowHandle: Window | undefined,
    onError: ((msg: string, detailedMsg: string) => void) | undefined,
    onJobCreated: ((financialRecordId: string) => void) | undefined,
    onAborted: (() => void) | undefined,
    isCancelled: () => boolean
): Promise<void> => {
    const textContent = new TextContent('en');
    await StartFinancialsImport(
        connectionInfo,
        cxnRequestDescriptor,
        windowHandle,
        onError,
        onJobCreated,
        onAborted,
        isCancelled,
        textContent
    );
}

export const FindConnection = async (accessToken: IDelegatedAccessToken, strongboxUri: string, orgId: string, accountingPackage: AccountingPackage): Promise<ConnectionDescriptor | undefined> => {
    const connections = new ConnectionsClient(accessToken, strongboxUri);

    try {
        const connectionsResponse = await connections.list(orgId);

        if (!goodResponse(connectionsResponse.status)) {
            return undefined;
        }

        const packageKey = accountingPackage.toLowerCase();

        const connectionsList = connectionsResponse.result;

        const cxnsForOrg = connectionsList.connections.filter(cxn => cxn.datasourceNameId.toLowerCase() === packageKey);

        if (cxnsForOrg) {
            // The iterator functions on arrays don't like async parameters so for loop it is.
            for (var iCxn = 0; iCxn < cxnsForOrg.length; iCxn++) {
                const cxn = cxnsForOrg[iCxn];
                try {
                    var testCxn = await connections.get(orgId, cxn.id);
                    if (goodResponse(testCxn.status) && (testCxn.result.state.toLowerCase() === 'connected')) {
                        return cxn;
                    }
                }
                catch (testCxnException) {
                }
            }
        }

        return undefined;
    } catch (listException) {
        return undefined;
    }
}

export const DisconnectConnection = async (connectionInfo: StrongboxConnectionDescriptor): Promise<boolean> => {
    if (!connectionInfo.existingConnectionId) {
        return false;
    }

    const connections = new ConnectionsClient(connectionInfo.delegatedAccessToken, connectionInfo.strongboxUri);

    try {
        var result = await connections.delete(connectionInfo.orgId, connectionInfo.existingConnectionId);

        return goodResponse(result.status);
    } catch (disconnectException) {
        return false;
    }
}
