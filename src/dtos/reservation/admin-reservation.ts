export interface AdminReservation {
    id: string;
    noOfPeople: number;
    bookingDate: Date;
    firstName: string;
    lastName: string;
    email: string;
    furtherRequest: string;
    status: string;
    phoneNumber: string;
}