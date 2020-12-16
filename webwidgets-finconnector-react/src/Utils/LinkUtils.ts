
import {AccountingPackage} from '../Models/AccountingPackages';

export type DesktopAuthResponse = {
    codeChallenge: string;
}

export function AccountingPackageConnectPrompt(accountingPackage: AccountingPackage): string {
    return accountingPackage === AccountingPackage.Xero ? 'Connect to Xero' : 'Connect to QuickBooks';
}

export function AccountingPackageName(accountingPackage: AccountingPackage): string {
    return accountingPackage === AccountingPackage.Xero ? 'Xero' : 'QuickBooks';
}
