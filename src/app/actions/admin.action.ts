import { AdminOrderQueryRequest } from "src/dtos/order/admin-order-query-request";
import { AdminReservation } from "src/dtos/reservation/admin-reservation";
import { AdminReservationQueryRequest } from "src/dtos/reservation/admin-reservation-query-request";

export class AdminGetReservations {
    static readonly type = '[ADMIN] Admin Get Reservations';
    constructor(public query: AdminReservationQueryRequest) {}
}

export class AdminGetReservationById {
    static readonly type = '[ADMIN] Admin Get Reservation By Id';
    constructor(public id: string) {}
}

export class AdminClearReservation {
    static readonly type = '[ADMIN] Admin Clear Reservation';
    constructor() {};
}

export class AdminUpdateReservation {
    static readonly type = '[ADMIN] Admin Update Reservation';
    constructor(public reservation: AdminReservation) {};
}

export class AdminGetOrders {
    static readonly type = '[ADMIN] Admin Get Orders';
    constructor(public query: AdminOrderQueryRequest) {}
}