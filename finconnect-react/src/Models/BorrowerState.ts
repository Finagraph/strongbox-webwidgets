export enum ControlState {
    button,
    borrower
}

export enum BorrowerSteps {
    acceptTerms,
    choosePackage,
    configureAccounting,
    progress,
    qbdProgress,
    congratulations,
    linkQbdIntro,
    linkQbdOpenAndGrantAccess,
    linkQbdShare,
}

export type BorrowerState = {
    state: ControlState;
    activeStep: BorrowerSteps;
}
