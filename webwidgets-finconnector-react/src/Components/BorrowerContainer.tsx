import * as React from 'react'
import '../styles.scss'

import ChoosePackage, { AccountingPackageToShow } from './ChoosePackage';
import LinkProgress from './LinkProgress';
import Congratulations from './Congratulations';
import { LinkerModal } from './StrongboxLinker/LinkerModal';

import { StartFinancialsImport } from '../Utils/ConnectStrongbox';

import { Theme } from '../Models/Theme/Theme';

import { BorrowerSteps } from '../Models/BorrowerState';

import {
    IDelegatedAccessToken
} from '../Models/Api/ClientBase';

import { AccountingPackage } from '../Models/AccountingPackages';

type ConnectState = {
    accountingPackage: AccountingPackage | undefined;
    waitingForAuthorization: boolean;
    cancelWaitAuthorization: boolean;
    successfulConnection: boolean;
    showLinkModal: boolean;
}

type ImportState = {
    financialRecordId: string;
    jobCreated: boolean;
    authWindow: Window | undefined;
    error: string | undefined;
    detailedError: string | undefined;
}

export type BorrowerContainerProps = {
    accountingPackages?: AccountingPackageToShow[];
    entityId: string;
    accessToken: IDelegatedAccessToken;
    theme?: Theme;
    step: BorrowerSteps;
    linkPctgComplete: number;
    children: JSX.Element;
    showConnectionDialog?: boolean;
    onNextStep: (step: BorrowerSteps, goToStep?: BorrowerSteps) => void;
    onLinkPctgChange: (pctComplete: number) => void;
    strongboxUri: string;
    onJobCreated?: (financialRecordId: string) => void;
}

const BorrowerContainer: React.FC<BorrowerContainerProps> = (props: BorrowerContainerProps): React.ReactElement => {
    const _linkModalRef: React.RefObject<any> = React.createRef();

    let divStyle: any = {};
    if (props.theme && props.theme.palette) {
        divStyle['backgroundColor'] = props.theme.palette.borrowerInteractionBackground;
    }

    const [importState, setImportState] = React.useState<ImportState>({
        financialRecordId: '',
        jobCreated: false,
        authWindow: undefined,
        error: undefined,
        detailedError: undefined,
    });

    const [connectState, setConnectState] = React.useState<ConnectState>({
        accountingPackage: undefined,
        waitingForAuthorization: false,
        cancelWaitAuthorization: false,
        successfulConnection: false,
        showLinkModal: false,
    });

    const OnAuthWindowOpen = (authWindow: Window): void => {
        setImportState({
            ...importState,
            authWindow: window,
        });
    }

    const OnImportError = (msg: string, detailedMsg: string): void => {
        setImportState({
            ...importState,
            error: msg,
            detailedError: detailedMsg,
            authWindow: undefined,
        });
        setConnectState({
            accountingPackage: undefined,
            waitingForAuthorization: false,
            cancelWaitAuthorization: false,
            successfulConnection: false,
            showLinkModal: false,
        });
    }

    const OnJobCreated = (financialRecordId: string): void => {
        setImportState({
            ...importState,
            financialRecordId,
            jobCreated: true,
            authWindow: undefined,
        });
        setConnectState({
            accountingPackage: undefined,
            waitingForAuthorization: false,
            cancelWaitAuthorization: false,
            successfulConnection: true,
            showLinkModal: false,
        });
    }

    const OnModalClosing = (): void => {
        setImportState({
            ...importState,
            authWindow: undefined,
        })
        setConnectState({
            accountingPackage: undefined,
            waitingForAuthorization: false,
            cancelWaitAuthorization: false,
            successfulConnection: false,
            showLinkModal: false,
        });
    }

    React.useEffect(() => {
        if ((connectState.accountingPackage) && (!connectState.showLinkModal)) {
            StartFinancialsImport(
                connectState.accountingPackage,
                props.accessToken,
                props.strongboxUri,
                props.entityId,
                OnImportError,
                OnJobCreated,
                OnModalClosing,
                () => connectState.cancelWaitAuthorization,
                OnAuthWindowOpen,
            );
        }
    }, [connectState.accountingPackage]);

    React.useEffect(() => {
        if (importState.jobCreated) {
            if (props.onJobCreated) {
                props.onJobCreated(importState.financialRecordId);
            }
            props.onNextStep(props.step);
        }
    }, [importState]);

    const ConnectToAccountingPackage = (accountingPackage: AccountingPackage): void => {
        setConnectState({
            accountingPackage,
            cancelWaitAuthorization: false,
            waitingForAuthorization: true,
            successfulConnection: false,
            showLinkModal: !!props.showConnectionDialog,
        });
    }

    const ExecuteConnect = (accountingPackage: AccountingPackage): void => {
        setConnectState({
            ...connectState,
            showLinkModal: false,
        });
        StartFinancialsImport(
            accountingPackage,
            props.accessToken,
            props.strongboxUri,
            props.entityId,
            OnImportError,
            OnJobCreated,
            OnModalClosing,
            () => connectState.cancelWaitAuthorization,
            OnAuthWindowOpen
        );
    }

    const focusAuthWindow = (): void => {
        importState.authWindow && importState.authWindow.onchange
    }

    const ProgressComplete = (): void => {
        props.onNextStep(props.step);
    }

    const CongratsComplete = (): void => {
        props.onNextStep(props.step);
    }

    const AbortChoosePackage = (): void => {
        props.onNextStep(BorrowerSteps.congratulations);
    }

    const centeredSteps = new Set([BorrowerSteps.progress, BorrowerSteps.congratulations]);

    let containerClassName = 'finagraph-strongbox-main-borrower-container';

    if (centeredSteps.has(props.step)) {
        containerClassName += ' finagraph-strongbox-main-borrower-container-centered';
    }

    return (
        <div style={divStyle} className={containerClassName}>

            {props.step === BorrowerSteps.choosePackage && (
                <ChoosePackage
                    abort={AbortChoosePackage}
                    accountingPackages={props.accountingPackages}
                    theme={props.theme}
                    showLinkDialog={ConnectToAccountingPackage}
                    children={props.children}
                    showError={importState.error}
                    authWindowActive={!!importState.authWindow}
                />
            )}
            {props.step === BorrowerSteps.progress && (
                <LinkProgress
                    theme={props.theme}
                    onProgressComplete={ProgressComplete}
                    children={props.children}
                    linkPctgComplete={props.linkPctgComplete}
                    onLinkPctgChange={props.onLinkPctgChange}
                />
            )}
            {props.step === BorrowerSteps.congratulations && (
                <Congratulations
                    theme={props.theme}
                    onDone={CongratsComplete}
                    children={props.children}
                />
            )}
            {props.children}
            {connectState.showLinkModal && connectState.accountingPackage && 
                <LinkerModal
                    accountingPackage={connectState.accountingPackage}
                    accessToken={props.accessToken}
                    orgId={props.entityId}
                    strongboxUri={props.strongboxUri}
                    theme={props.theme}
                    executeConnect={ExecuteConnect}
                    onCompleted={OnModalClosing}
                />
            }
        </div>
    );
}

export default BorrowerContainer;

