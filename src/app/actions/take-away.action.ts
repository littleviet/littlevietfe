export class GetTakeAwayProducts {
    static readonly type = '[TAKEWAY] Get Take Away Products'
}

export class UpdateCart {
    static readonly type = '[TAKEWAY] Update Cart'
    constructor(public quantity: number, public productId: string) {
    }
}
