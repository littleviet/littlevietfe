import { AdminReservationQueryRequest } from "src/dtos/reservation/admin-reservation-query-request";

export class AdminGetReservations {
    static readonly type = '[ADMIN] Admin Get Reservations'
    constructor(public query: AdminReservationQueryRequest) {}
}

export class AdminGetReservationById {
    static readonly type = '[ADMIN] Admin Get Reservation By Id'
    constructor(public id: string) {}
}