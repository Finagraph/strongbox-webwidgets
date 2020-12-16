import './StrongboxLinkModal.scss';

import * as React from 'react';

import { SimpleModal } from '../../StrongboxModal';
import StrongboxLinker, { StrongboxLinkerChildProps } from '../../StrongboxLinker/StrongboxLinker';

import CircularProgress from '@material-ui/core/CircularProgress';
import { ThemeProvider } from '@material-ui/core/styles';

import { BuildThemeStyle, Theme } from '../../../Models/Theme/Theme';
import { defaultControlFontStyleMap, defaultModalRegularFontStyleMap, defaultModalSecurityFontStyleMap } from '../../../Models/Theme/ThemeFont';
import { defaultControlPaletteStyleMap } from '../../../Models/Theme/ThemePalette';
import { defaultControlStyleMap } from '../../../Models/Theme/ThemeControls';
import { AccountingPackage } from '../../../Models/AccountingPackages';
import { IDelegatedAccessToken } from '../../../Models/Api/ClientBase';
import { AccountingPackageConnectPrompt } from '../../../Utils/LinkUtils';
import { CreateStdTheme } from '../../../Utils/Style';

type Props = {
    accountingPackage: AccountingPackage;
    entityId: string;
    onJobCreated?: (financialRecordId: string) => void;
    onRequestClose: (success: boolean) => void;
    open: boolean;
    strongboxUrl: string;
    submissionId?: string;
    accessToken: IDelegatedAccessToken;
    theme?: Theme;
    updateProgress: (progress: number) => void;
    executeConnect: (accountingPackage: AccountingPackage) => void;
};

class StrongboxLinkModal extends React.PureComponent<Props> {
    public static defaultProps = {
        open: false,
    };

    constructor(props: Props) {
        super(props);

        this.RenderAccountingPackage = this.RenderAccountingPackage.bind(this);
        this.RenderConnectToQuickBooks = this.RenderConnectToQuickBooks.bind(this);
        this.RenderConnectToXero = this.RenderConnectToXero.bind(this);
    }

    private _regularTextStyle: any = {};
    private _securityTextStyle: any = {};

    public componentDidMount() {
        this._regularTextStyle = BuildThemeStyle(
            {},
            {
                container: 'palette',
                map: [{ containerName: 'modalText', styleName: 'color' }]
            },
            this.props.theme
        );
        this._regularTextStyle = BuildThemeStyle(this._regularTextStyle, defaultModalRegularFontStyleMap, this.props.theme);

        this._securityTextStyle = BuildThemeStyle(
            {},
            {
                container: 'palette',
                map: [{ containerName: 'modalText', styleName: 'color' }]
            },
            this.props.theme
        );
        this._securityTextStyle = BuildThemeStyle(this._securityTextStyle, defaultModalSecurityFontStyleMap, this.props.theme);
    }

/*
 * MODIFICATIONS FOR XERO UI
 * 
 * Show xero descriptions where appropriate
 */
    
    private _descriptionText = 'After clicking \'Connect to QuickBooks\', Intuit will prompt you to ' +
        'authorize a connection to QuickBooks. This will allow your information to be sent to your lender ' +
        'and you\'ll be on your way!';

    private _descriptionTextXero = 'After clicking \'Connect to Xero\', Xero will prompt you to ' +
        'authorize a connection to Xero. This will allow your information to be sent to your lender ' +
        'and you\'ll be on your way!';

    public render() {
        const {
            entityId,
            onRequestClose,
            open,
        } = this.props;

        return open && (
            <StrongboxLinker
                autoStartOnAuthorized={true}
                datasourceId={this.props.accountingPackage}
                theme={this.props.theme}
                executeConnect={this.props.executeConnect}
            >
                {(props): JSX.Element => {
                    let buttonStyle = BuildThemeStyle({}, defaultControlPaletteStyleMap, props.theme);
                    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlFontStyleMap, props.theme);
                    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

                    const actions = props.authorized ? 
                        [
                            <button
                                style={buttonStyle}
                                key={'disconnect-action'}
                                onClick={() => {
                                    props.disconnect();
                                }}
                            >
                                Disconnect
                            </button>,
                        ] :
                        undefined;

                    const GetAuthorizedContent = (): React.ReactNode => {
                        if (props.disconnecting) {
                            return (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <span style={{ ...this._regularTextStyle, marginBottom: '20px' }}>Disconnecting</span>
                                    <CircularProgress
                                        color="primary"
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <button
                                    style={buttonStyle}
                                    onClick={() => {
                                        props.startJob();
                                    }}
                                >
                                    Update Financials Now
                                </button>
                            );
                        }
                    }

                    const RenderProgress = (): React.ReactNode => {
                        if (props.errorState !== 'none') {
                            return (<></>);
                        }
                        return (
                            <div style={{
                                marginBottom: '20px',
                            }}>
                                <CircularProgress
                                    color="primary"
                                />
                            </div>
                        );
                    }

                    const RenderErrorState = (): React.ReactNode => {
                        return (
                            <div style={{
                                marginBottom: '20px',
                            }}>
                                <p>An unexpected error has occurred. This is most likely due to a required service being unavailable. Please try this operation again later</p>
                            </div>
                        );
                    }

                    return (
                        <SimpleModal
                            actions={actions}
                            className={`finagraph-strongbox-linker__link-modal ${props.initialized ? '' : 'loading'}`}
                            contentClassName={''}
                            closeOnOverlayClick={false}
                            onCancelLabel={'Cancel'}
                            onClose={(): void => {
                                onRequestClose(false);
                            }}
                            theme={props.theme}
                            title={AccountingPackageConnectPrompt(this.props.accountingPackage)}
                        >
                            <ThemeProvider theme={CreateStdTheme()} >
                                <div
                                    className={'finagraph-strongbox-link-modal__content-container'}>
                                    {props.errorState !== 'none' && RenderErrorState()}
                                    {props.initialized && props.authorized && GetAuthorizedContent()}
                                    {props.initialized && !props.authorized && this.RenderAccountingPackage(props)}
                                    {!props.initialized && RenderProgress()}
                                </div>
                            </ThemeProvider>
                        </SimpleModal>
                    );
                }}
            </StrongboxLinker>
        );
    }

    private OnError = (msg: string, detailedMsg: string): void => {
    }

    private OnCompleted = (success: boolean): void => {

    }

    private isCancelled = (): boolean => {
        return false;
    }

    private RenderConnectToQuickBooks = (props: StrongboxLinkerChildProps): React.ReactNode => {
        /*
                <div className={'finagraph-strongbox-linker__connect-graphic'}>
                    <SVG src={'https://booyamiflight.blob.core.windows.net/static/ConnectToQuickBooks.svg'} />
                </div>
         */
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this._descriptionText}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    Information in QuickBooks will never be altered in any way. This is a fully secure, one-way data
                    stream. 
                </span>
                {props.renderAuthButton({
                    className: 'finagraph-strongbox-linker__auth-button',
                })}
            </>
        );
    }

    private RenderConnectToXero = (props: StrongboxLinkerChildProps): React.ReactNode => {
        return (
            <>
                <span style={this._regularTextStyle} className={'finagraph-strongbox-linker__description secondary'}>{this._descriptionTextXero}</span>
                <span style={this._securityTextStyle} className={'finagraph-strongbox-linker__connect-graphic-description secondary'}>
                    Information in Xero will never be altered in any way. This is a fully secure, one-way data
                    stream. 
                </span>
                {props.renderAuthButton({
                    className: 'finagraph-strongbox-linker__auth-button',
                })}
            </>
        );
    }

    private RenderAccountingPackage = (props: StrongboxLinkerChildProps): React.ReactNode => {
        if (this.props.accountingPackage === AccountingPackage.Xero) {
            return this.RenderConnectToXero(props);
        } else {
            return this.RenderConnectToQuickBooks(props);
        }
    }
}

export default StrongboxLinkModal;


