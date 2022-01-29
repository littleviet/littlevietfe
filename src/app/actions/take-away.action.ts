export class GetTakeAwayProducts {
    static readonly type = '[TAKEWAY] Get Take Away Products'
}

export class UpdateCart {
    static readonly type = '[TAKEWAY] Update Cart'
    constructor(public quantity: number, public servingId: string) {
    }
}

export class UpdatePickUpTime {
    static readonly type = '[TAKEWAY] Update Pick Up Time'
    constructor(public time: string) {
    }
}

export class CheckOutCart {
    static readonly type = '[TAKEWAY] Check Out Cart'
    constructor(public paymentInfo: any) {
    }
}

export class ClearCart {
    static readonly type = '[TAKEWAY] Clear Cart'
    constructor() {
    }
}

export class UpdateReservationInfo {
    static readonly type = '[TAKEWAY] Update Reservation Info'
    constructor(public reservationInfo: any) {
    }
}

export class UpdateReservationBookerInfo {
    static readonly type = '[TAKEWAY] Update Reservation Booker Info'
    constructor(public reservationBookerInfo: any) {
    }
}

export class ClearReservation {
    static readonly type = '[TAKEWAY] Clear Reservation'
}
