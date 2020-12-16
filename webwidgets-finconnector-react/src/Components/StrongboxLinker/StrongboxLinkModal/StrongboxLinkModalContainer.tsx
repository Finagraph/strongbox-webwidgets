import * as React from 'react';


import StrongboxLinkModal from './StrongboxLinkModal';
import { Theme } from '../../../Models/Theme/Theme';
import { IDelegatedAccessToken } from '../../../Models/Api/ClientBase';
import { AccountingPackage } from '../../../Models/AccountingPackages';
import { IOpenableModal } from '../../../Models/IOpenableModal';

export interface IStrongboxLinkModalContainerProps {
    accountingPackage: AccountingPackage;
    entityId: string;
    strongboxUrl: string;
    submissionId?: string;
    accessToken: IDelegatedAccessToken;
    theme?: Theme;
    executeConnect: (accountingPackage: AccountingPackage) => void;
    onRequestClose: (success: boolean) => void;
}

type Props = IStrongboxLinkModalContainerProps;

type State = {
};

class StrongboxLinkModalContainer extends React.PureComponent<Props, State> implements IOpenableModal {
    constructor(props: Props) {
        super(props);

        this.state = {
        };
    }

    public render() {
        const {
            accountingPackage,
            entityId,
            accessToken,
            strongboxUrl,
            submissionId,
            theme
        } = this.props;

        if (!entityId) {
            return false;
        }

        return (
            <StrongboxLinkModal
                accountingPackage={accountingPackage}
                entityId={entityId}
                onRequestClose={this.props.onRequestClose}
                executeConnect={this.props.executeConnect}
                open={true}
                strongboxUrl={strongboxUrl}
                submissionId={submissionId}
                accessToken={accessToken}
                theme={theme}
                updateProgress={this.UpdateProgress}
            />
        );
    }

    public CloseModal = (): void => {
        this.props.onRequestClose && this.props.onRequestClose(false);
    }

    public OpenModal = (): void => {
    }
    
    private UpdateProgress = (progress: number): void => {
    }
}

export default StrongboxLinkModalContainer;

