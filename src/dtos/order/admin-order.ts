import { OrderType, PaymentType } from "src/commons/enums/app-enum";
import { AdminAccount } from "../account/admin-account";

export interface AdminOrder {
    id: string;
    account: AdminAccount;
    orderType: OrderType;
    paymentType: PaymentType;
    totalPrice: number;
    pickupTime: Date;
}