export enum ControlState {
    button,
    borrower
}

export enum BorrowerSteps {
    choosePackage,
    configureAccounting,
    progress,
    congratulations,
}

export type BorrowerState = {
    state: ControlState;
    activeStep: BorrowerSteps;
}
