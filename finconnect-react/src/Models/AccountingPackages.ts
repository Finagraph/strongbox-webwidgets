export enum AccountingPackage {
    QuickBooksOnline = "QuickBooksOnline",
    SageOne = "SageOne",
    QuickBooksDesktop = "QuickBooksDesktop",
    AccountRightLive = "AccountRightLive",
    FreshBooks = "FreshBooks",
    Dynamics365 = "Dynamics365",
    Xero = "Xero",
}

export type AccountingPkgPresentation = {
    featureName: AccountingPackage;
    descriptor: string | undefined;
    linkFunc?: () => void;
};

