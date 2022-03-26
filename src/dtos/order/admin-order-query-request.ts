import { OrderStatus, OrderType, PaymentType } from "src/commons/enums/app-enum";

export class AdminOrderQueryRequest {
    orderTypes: OrderType[] | null = null;
    email: string | null = null;
    totalPriceFrom: number | null = null;
    totalPriceTo: number | null = null;
    paymentTypes: PaymentType[] | null = null;
    pickupTimeFrom: string | null = null;
    pickupTimeTo: string | null = null;
    pageNumber: number | null = 1;
    pageSize: number | null = 10;
    orderBy: string | null = null;
    fullName: string | null = null;
    phoneNumber: string | null = null;
    statuses: OrderStatus[] | null = null;
}