export class ExpectedError extends Error {
    public readonly dialogTitle: string
    public readonly dialogMsg: string

    constructor(dialogTitle: string, dialogMsg: string) {
        super(dialogTitle)
        this.name = 'ExpectedError'

        this.dialogTitle = dialogTitle
        this.dialogMsg = dialogMsg
    }
}

export class ExpiredAuthKeyError extends ExpectedError {
    constructor() {
        super('Authentication Key Expired', 'Please check your in-game Warp Records to generate a new authentication key')
    }
}

export class MissingAuthKeyError extends ExpectedError {
    constructor() {
        super('Authentication Key Missing', 'Please check your in-game Warp Records to generate a new authentication key')
    }
}
