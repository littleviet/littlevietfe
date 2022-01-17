export class Login {
    static readonly type = '[AUTHENTICATION] Login'
    constructor(public loginInfo: any) {}
}

export class AutoLogin {
    static readonly type = '[AUTHENTICATION] Auto Login'
    constructor() {}
}
