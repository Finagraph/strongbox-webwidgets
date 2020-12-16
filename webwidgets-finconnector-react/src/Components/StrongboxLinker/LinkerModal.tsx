import * as React from 'react';

import StrongboxLinkModalContainer from './StrongboxLinkModal/StrongboxLinkModalContainer';
import { IOpenableModal } from '../../Models/IOpenableModal';

import { Theme } from '../../Models/Theme/Theme';
import { IDelegatedAccessToken } from '../../Models/Api/ClientBase';
import { AccountingPackage } from '../../Models/AccountingPackages';

export interface ISBLinkerModalProps {
    accountingPackage: AccountingPackage;
    accessToken: IDelegatedAccessToken;
    strongboxUri: string;
    orgId: string;
    executeConnect: (accountingPackage: AccountingPackage) => void;
    onCompleted: (success: boolean) => void,
    className?: string;
    disabled?: boolean;
    icon?: string;
    label?: string;
    primary?: boolean;
    rootStyle?: React.CSSProperties;
    showProgress?: boolean;
    secondary?: boolean;
    style?: React.CSSProperties;
    submissionId?: string;
    theme?: Theme;
    tooltip?: React.ReactNode;
}

export class LinkerModal extends React.PureComponent<ISBLinkerModalProps> {

    public static defaultProps: any = {
        buttonProps: {},
        icon: 'refresh',
        label: 'Link',
        showProgress: true,
    };

    private _modal: IOpenableModal;

    public render() {
        return (
            <div className={this.props.className} style={this.props.rootStyle}>
                {this.RenderModal()}
            </div>
        );
    }

    public OnClick = (): void => {
        this._modal.OpenModal();
    }

    private RenderModal = (): JSX.Element | false => {
        const { accountingPackage, orgId } = this.props;

        let content: JSX.Element | false = false;
        if (
            (accountingPackage === AccountingPackage.QuickBooksOnline) ||
            (accountingPackage === AccountingPackage.Xero)
        ) {
            content = (
                <StrongboxLinkModalContainer
                    accountingPackage={accountingPackage}
                    entityId={orgId}
                    strongboxUrl={this.props.strongboxUri}
                    submissionId={this.props.submissionId}
                    accessToken={this.props.accessToken}
                    theme={this.props.theme}
                    executeConnect={this.props.executeConnect}
                    onRequestClose={this.props.onCompleted}
                    ref={(r: StrongboxLinkModalContainer): any => this._modal = r}
                />
            );
        }

        return content;
    }
}
