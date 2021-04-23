import { AccountingPackage } from '../Models/AccountingPackages';

import { TextContent } from '../Components/TextContent/TextContent';
import { translations } from '../Components/TextContent/en/en';

export type DesktopAuthResponse = {
    codeChallenge: string;
}

export function AccountingPackageConnectPrompt(accountingPackage: AccountingPackage, textContent?: TextContent): string {
    let connectTo = translations.ConnectToAccountingPkg;
    let unknown = translations.UnknownAccountingPkg;
    if (textContent) {
        connectTo = textContent.TextValue('ConnectToAccountingPkg');
        unknown = textContent.TextValue('UnknownAccountingPkg');
    }

    switch (accountingPackage) {
        case AccountingPackage.Xero:
            return `${connectTo} Xero`;
        case AccountingPackage.QuickBooksDesktop:
            return `${connectTo} QuickBooks Desktop`;
        case AccountingPackage.QuickBooksOnline:
            return `${connectTo} QuickBooks`;
        default:
            return unknown;
    }
}

export function AccountingPackageName(accountingPackage: AccountingPackage): string {
    switch (accountingPackage) {
        case AccountingPackage.Xero:
            return 'Xero';
        case AccountingPackage.QuickBooksDesktop:
            return 'QuickBooks Desktop';
        case AccountingPackage.QuickBooksOnline:
            return 'QuickBooks';
        default:
            return 'Unknown Accounting Package';
    }
}
