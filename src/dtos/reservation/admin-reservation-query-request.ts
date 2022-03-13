import { ReservationStatus } from "src/commons/enums/app-enum";

export class AdminReservationQueryRequest {
    fullName: string | null = null;
    email: string | null = null;
    furtherRequest: string | null = null;
    noOfPeople: number | null = null;
    bookingDateFrom: string | null = null;
    bookingDateTo: string | null = null;
    statuses: ReservationStatus[] | null = null;
    phoneNumber: string | null = null;
    pageNumber: number | null = 1;
    pageSize: number | null = 10;
    orderBy: string | null = null;
}