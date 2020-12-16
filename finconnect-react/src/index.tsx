/*
 * ----------------- Huge helpful hint --------------------
 * 
 * This applies primarily for a solution that allows local development using npm link.  You can
 * avoid all of this headache by not doing that and using relative paths instead.  There's a package
 * file checked in called package.local.  Copy that to package.json, delete node_modules and dist 
 * folders, run npm install and you should be good to go.
 * 
 * If you get the following error:
 * 
 * Error: Invalid hook call. Hooks can only be called inside the body of a function component
 * ...
 * 
 * It is possible that you simply are not calling the hook inside of the function component, but
 * more likely you've built this component and run 'npm link' to create a local symbolic link to
 * the project. 
 * 
 * Then to consume it so you can dev on it, in your consuming project you ran 'npm link strongbox-sdk'
 * Seems simple enough but react gets confused and thinks a different version of the dom from react
 * are being used (or some crap like that.)
 * 
 * The method I found for solving this was, essentially to make this component use symbolic links to
 * react that resolve back to the consuming project.
 * 
 * In the consuming application:
 *  cd node_modules/react
 *  npm link
 *  cd ..\react-dom
 *  npm link
 *  cd ..\react-modal
 *  npm link
 *  
 * In this project (the library)
 *  npm link react
 *  npm link react-dom
 *  npm link react-modal
 *   *  
 *  There are myriad discussions about this on the Interwebs but this is the one that ended up working
 *  for me.
*/

import * as React from 'react'
import './styles.scss'

import LinkButton from './Components/LinkButton';
import BorrowerContainer from './Components/BorrowerContainer';
import { BorrowerState, BorrowerSteps, ControlState } from './Models/BorrowerState';

import { BuildThemeStyle, Theme } from './Models/Theme/Theme';
import { defaultFontStyleMap } from './Models/Theme/ThemeFont';
import { defaultContainerStyleMap } from './Models/Theme/ThemeContainer';

import { AccountingPackageToShow, SupportedAccountingPackages } from './Components/ChoosePackage';

import { WebPortalClient } from './Models/Api/strongbox.client';

import { LinkerModal } from './Components/StrongboxLinker/LinkerModal';
import { InitializeOrganizationParameters } from './Models/Api/strongbox.models';
import { IDelegatedAccessToken } from './Models/Api/ClientBase';

const strongboxUrlConst = 'https://api.strongbox.link';

export {
    BorrowerSteps,
    AccountingPackageToShow,
    SupportedAccountingPackages,
};

export type SBLinkAccountingPackageChildProps = {
    step: BorrowerSteps;
    pctComplete?: number;
};

type SBLinkAccountingPackageProps = {
    children: (props: SBLinkAccountingPackageChildProps) => JSX.Element | undefined;
    className: string;
    entityId: string;
    strongboxNexusUrl: string;
    accessToken: IDelegatedAccessToken;
    borrowerState: BorrowerState;
    theme?: Theme,
    onLinkPackageClick: (event: React.MouseEvent) => void;
    onNextStep: (step: BorrowerSteps, goToStep?: BorrowerSteps) => void;
    accountingPackages?: AccountingPackageToShow[];
    disabled?: boolean;
    onJobCreated?: (financialRecordId: string) => void;
    showConnectionDialog?: boolean;
}

const SBLinkAccountingPackage: React.FC<SBLinkAccountingPackageProps> = (props: SBLinkAccountingPackageProps): React.ReactElement => {
    let divStyle: any = {};

    const [linkPctgComplete, setLinkPctgComplete] = React.useState<number>(0);

    if (props.theme && props.theme.palette) {
        divStyle['backgroundColor'] = props.theme.palette.windowBackground;
    }

    divStyle = BuildThemeStyle(divStyle, defaultFontStyleMap, props.theme);
    divStyle = BuildThemeStyle(divStyle, defaultContainerStyleMap, props.theme);

    let stepChildren;
    if (props.borrowerState.state === ControlState.borrower) {
        stepChildren = props.children({
            step: props.borrowerState.activeStep,
            pctComplete: linkPctgComplete,
        });
    }

    // The link element below is required for being able to use material-ui icons.

    return (
        <div style={divStyle} className={`finagraph-strongbox-borrower-portal ${props.className}`}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            {props.borrowerState.state === ControlState.button && <LinkButton disabled={props.disabled} theme={props.theme} onClick={props.onLinkPackageClick} />}
            {props.borrowerState.state === ControlState.borrower && (
                <BorrowerContainer
                    accountingPackages={props.accountingPackages}
                    entityId={props.entityId}
                    accessToken={props.accessToken}
                    theme={props.theme}
                    step={props.borrowerState.activeStep}
                    linkPctgComplete={linkPctgComplete}
                    onNextStep={props.onNextStep}
                    onLinkPctgChange={setLinkPctgComplete}
                    strongboxUri={props.strongboxNexusUrl}
                    onJobCreated={props.onJobCreated}
                    showConnectionDialog={props.showConnectionDialog}
                >
                    {stepChildren}
                </BorrowerContainer>
            )}
        </div >
    );
}

// Exposing only onFailureToSetBusinessName at the moment as I don't really
// want to get into exposing a more general purpose error handler at the
// moment.

export type ISBLinkAccountingPackageProps = {
    className?: string
    orgId: string;
    orgName?: string;
    accessToken: IDelegatedAccessToken;
    theme?: Theme;
    accountingPackages?: AccountingPackageToShow[];
    disabled?: boolean;
    children: (props: SBLinkAccountingPackageChildProps) => JSX.Element | undefined;
    onFailureToSetBusinessName?: (response?: Response) => void;
    runEnvironment?: string;
    onJobCreated?: (financialRecordId: string) => void;
    showConnectionDialog?: boolean;
}

const App: React.FC<ISBLinkAccountingPackageProps> = (props: ISBLinkAccountingPackageProps): React.ReactElement => {
    const [borrowerState, setBorrowerState] = React.useState<BorrowerState>({
        activeStep: BorrowerSteps.choosePackage,
        state: ControlState.button,
    });

    const strongboxUri = (): string => {
        let strongboxNexusUrl = strongboxUrlConst;

        return strongboxNexusUrl;
    }

    React.useEffect(() => {
        if (!(props.orgName && props.accessToken && props.accessToken.accessToken)) {
            return;
        }

        try {
            const webPortal = new WebPortalClient(props.accessToken, strongboxUri());
            webPortal.initializeOrganization(props.orgId, new InitializeOrganizationParameters({ 'displayName': props.orgName }));
        } catch (setNameException) {
            console.error(`Exception thrown setting the business name for orgId: ${props.orgId}, orgName: ${props.orgName}`);
            console.error(setNameException);
            props.onFailureToSetBusinessName && props.onFailureToSetBusinessName();
        }
    }, [props.orgName, props.orgId, props.accessToken]);


    return (<SBLinkAccountingPackage
        accountingPackages={props.accountingPackages}
        children={props.children}
        className={props.className || ''}
        disabled={props.disabled}
        entityId={props.orgId}
        borrowerState={borrowerState}
        accessToken={props.accessToken}
        strongboxNexusUrl={strongboxUri()}
        theme={props.theme}
        onLinkPackageClick={(event: React.MouseEvent): void => {
            setBorrowerState({
                ...borrowerState,
                state: ControlState.borrower,
            });
        }}
        onJobCreated={props.onJobCreated}
        showConnectionDialog={props.showConnectionDialog}
        onNextStep={(step: BorrowerSteps, goToStep?: BorrowerSteps): void => {
            let nextStep: BorrowerSteps;
            let controlState = ControlState.borrower;

            // choosePackage is 0 so don't use !goToStep
            if (goToStep !== undefined) {
                nextStep = goToStep;
            } else {
                switch (step) {
                    case BorrowerSteps.choosePackage:
                        nextStep = BorrowerSteps.progress;
                        break;
                    case BorrowerSteps.progress:
                        nextStep = BorrowerSteps.congratulations;
                        break;
                    case BorrowerSteps.congratulations:
                        nextStep = BorrowerSteps.choosePackage;
                        controlState = ControlState.button;
                        break;
                    default:
                        return;
                }
            }

            setBorrowerState({
                ...borrowerState,
                state: controlState,
                activeStep: nextStep,
            });
        }}
    />);
}

export default App
export {
    LinkerModal,
    Theme
}
