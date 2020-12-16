import * as React from 'react';
import { AccountingPackage } from '../../Models/AccountingPackages';

import { Theme } from '../../Models/Theme/Theme';
import { ConnectButton } from '../ConnectButton';

import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

type ConnectButtonProps = {
};

export type StrongboxLinkerChildProps = {
    authorized: boolean | undefined;
    initialized: boolean;
    disconnecting: boolean;
    disconnect: () => Promise<void>;
    renderAuthButton: (props?: Partial<ConnectButtonProps>) => JSX.Element;
    startJob: () => Promise<void>;
    theme?: Theme;
    errorState: 'none' | 'initializationFailed';
};

export type Props = {
    autoStartOnAuthorized?: boolean;
    autoStartOnIntialized?: boolean;
    children: (props: StrongboxLinkerChildProps) => JSX.Element;
    datasourceId: AccountingPackage;
    executeConnect: (accountingPackage: AccountingPackage) => void;
    theme?: Theme;
};

export type State = {
    waiting: boolean;
    /* True if Initialize has completed. */
    initialized: boolean;
    disconnecting: boolean;
    errorInitializing: boolean;
};

class StrongboxLinker extends React.PureComponent<Props, State> {
    public static defaultProps = {
        autoStartOnAuthorized: false,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            waiting: false,
            initialized: true,
            disconnecting: false,
            errorInitializing: false,
        };
    }

    public render() {
        const { initialized, disconnecting } = this.state;

        const authorized = false;

        const childrenProps: StrongboxLinkerChildProps = {
            authorized,
            disconnect: this.DisconnectConnection,
            disconnecting,
            initialized: initialized,
            renderAuthButton: this.RenderAuthButton,
            startJob: this.CreateJob,
            theme: this.props.theme,
            errorState: this.state.errorInitializing ? 'initializationFailed' : 'none',
        };

        return this.props.children(childrenProps);
    }

    private DisconnectConnection = async (): Promise<void> => {
    }

    private CreateJob = async (): Promise<void> => {
    }

    private AuthorizeConnection = (): void => {
        this.props.executeConnect(this.props.datasourceId);
    }

    private RenderAuthButton = (props?: Partial<ConnectButtonProps>): JSX.Element => {
        const { datasourceId } = this.props;

        return (
            <div>
                {this.state.waiting && <LoadingIndicator active={true} overlayType={LoadingIndicator.OverlayType.Dark} />}
                <ConnectButton
                    style={{
                        marginTop: '20px',
                    }}
                    datasourceId={datasourceId}
                    onClick={() => {
                        this.AuthorizeConnection();
                    }}
                />
            </div>
        );
    }
}

export default StrongboxLinker;
