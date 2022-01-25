export class Login {
    static readonly type = '[AUTHENTICATION] Login'
    constructor(public loginInfo: any) {}
}

export class AutoLogin {
    static readonly type = '[AUTHENTICATION] Auto Login'
    constructor() {}
}

export class Logout {
    static readonly type = '[AUTHENTICATION] Logout'
    constructor() {}
}

export class CreateAccount {
    static readonly type = '[AUTHENTICATION] Create Account'
    constructor(public regAccountInfo: any) {}
}

