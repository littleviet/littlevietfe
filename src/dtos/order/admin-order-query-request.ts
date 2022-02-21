import { OrderType } from "src/commons/enums/app-enum";

export class AdminOrderQueryRequest {
    orderTypes: OrderType[] | null = null;
    email: string | null = null;
    totalPriceFrom: number | null = null;
    totalPriceTo: number | null = null;
    paymentTypes: string | null = null;
    pickupTimeFrom: Date | null = null;
    pageNumber: number | null = 1;
    pageSize: number | null = 10;
    orderBy: string | null = null;
    fullName: string | null = null;
    phoneNumber: string | null = null;
}