import { ReservationStatus } from "src/commons/enums/app-enum";

export class AdminReservationQueryRequest {
    fullName: string | null = null;
    lastName: string | null = null;
    email: string | null = null;
    furtherRequest: string | null = null;
    noOfPeople: number | null = null;
    bookingDateFrom: Date | null = null;
    bookingDateTo: Date | null = null;
    statuses: ReservationStatus[] | null = null;
    phoneNumber: string | null = null;
    pageNumber: number | null = 1;
    pageSize: number | null = 3;
    orderBy: string | null = null;
}