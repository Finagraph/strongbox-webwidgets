import * as React from 'react'
import '../styles.scss'

import { BuildThemeStyle, Theme } from '../Models/Theme/Theme';
import { defaultControlStyleMap } from '../Models/Theme/ThemeControls';
import { generalWindowBackground, paragraphText } from '../Models/Theme/Colors';

import ContractIcon from '@material-ui/icons/ExpandLessRounded';
import { AccountingPackage, AccountingPkgPresentation } from '../Models/AccountingPackages';

import { AccountingPackages } from './AccountingPackages';

export type SupportedAccountingPackages =
    AccountingPackage.QuickBooksOnline |
    AccountingPackage.Xero;

export type AccountingPackageToShow = {
    descriptor?: string;
    package: SupportedAccountingPackages;
}

export type ChoosePackageProps = {
    accountingPackages?: AccountingPackageToShow[];
    theme?: Theme;
    abort?: () => void;
    showLinkDialog: (accountingPackage: AccountingPackage) => void;
    children?: JSX.Element;
    showError?: string | undefined;
    authWindowActive: boolean;
}

const ChoosePackage: React.FC<ChoosePackageProps> = (props: ChoosePackageProps): React.ReactElement => {
    const headerStyle = BuildThemeStyle(
        {},
        {
            container: 'font',
            map: [
                { containerName: 'size_h1', styleName: 'fontSize' },
                { containerName: 'weight_h1', styleName: 'fontWeight' }
            ]
        },
        props.theme
    );
    let buttonStyle = BuildThemeStyle({ border: 'none', color: paragraphText },
        {
            container: 'palette',
            map: [
                { containerName: 'windowBackground', styleName: 'backgroundColor' }
            ]
        },
        props.theme
    );
    if (!(buttonStyle.backgroundColor)) {
        buttonStyle.backgroundColor = generalWindowBackground;
    }
    buttonStyle = BuildThemeStyle(buttonStyle, defaultControlStyleMap, props.theme);

    let pushButtonStyle = BuildThemeStyle({}, defaultControlStyleMap, props.theme);

    const QuickBooksOnlineLink = (): void => {
        props.showLinkDialog(AccountingPackage.QuickBooksOnline);
    }

    const XeroLink = (): void => {
        props.showLinkDialog(AccountingPackage.Xero);
    }

    const fullAccountingPackages: AccountingPkgPresentation[] = [
        {
            featureName: AccountingPackage.QuickBooksOnline,
            descriptor: 'Online',
            linkFunc: QuickBooksOnlineLink,
        },
        {
            featureName: AccountingPackage.Xero,
            descriptor: undefined,
            linkFunc: XeroLink,
        }
    ]

    const [activeAccountingPackages, setActiveAccountingPackages] = React.useState<AccountingPkgPresentation[]>(fullAccountingPackages);

    React.useEffect(() => {
        if (!props.accountingPackages) {
            const newPackages: AccountingPkgPresentation[] = fullAccountingPackages.slice();
            setActiveAccountingPackages(newPackages);
        } else {
            const newPackages: AccountingPkgPresentation[] = [];

            props.accountingPackages.forEach(pkg => {
                const pkgPresentation = fullAccountingPackages.find(knownPkg => knownPkg.featureName.toLowerCase() === pkg.package.toLowerCase());
                if (pkgPresentation) {
                    const pkgToAdd = pkgPresentation;

                    if (pkg.descriptor || (pkg.descriptor !== undefined && pkg.descriptor === '')) {
                        pkgToAdd.descriptor = pkg.descriptor;
                    }
                    newPackages.push(pkgToAdd);
                }
            });

            setActiveAccountingPackages(newPackages);
        }
    }, [props.accountingPackages]);

    const PackageInvoke = (accountingPackage: AccountingPkgPresentation): void => {
        accountingPackage.linkFunc();
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1 style={headerStyle}>Securely Submit Financial Data</h1>
                <button
                    style={{
                        ...buttonStyle,
                        height: '40px',
                        padding: '8px 8px 12px 8px',
                    }}
                    disabled={props.authWindowActive}
                    onClick={props.abort}
                >
                    <ContractIcon />
                </button>
            </div>
            { props.showError && (
                <p style={{
                    color: "red",
                    marginBottom: "15px"
                }}>{props.showError}</p>
            )}
            { props.authWindowActive && (
                <p style={{
                    marginBottom: "15px"
                }}>
                    A Browser window is currently open to authenticate with your accounting package.  Please authenticate in that window or close it.
                </p>
            )}
            <AccountingPackages
                style={{
                    marginTop: '10px',
                }}
                buttonsDisabled={props.authWindowActive}
                accountingPackages={activeAccountingPackages}
                onPackageInvoke={PackageInvoke}
            />
            {!(props.children) && (
                <div style={{ marginTop: '15px' }}>
                    <p>
                        Click on your accounting package above to authorize a secure connection to the
                        financial data needed to fulfill your application
                    </p>
                    <ul>
                        <li>Profit & Loss Statements</li>
                        <li>Balance Sheets</li>
                        <li>Transaction Data</li>
                    </ul>
                    <p>Note: Strongbox does NOT gather personal information such as Social Security Numbers</p>
                </div>
            )}
        </>
    );
}

export default ChoosePackage;
