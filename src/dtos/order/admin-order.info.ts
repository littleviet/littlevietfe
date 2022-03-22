import { OrderStatus, OrderType, PaymentType } from "src/commons/enums/app-enum";
import { AdminAccount } from "../account/admin-account";
import { AdminOrderDetail } from "../order-detail/admin-order-detail";

export interface AdminOrderInfo {
    id: string;
    orderType: OrderType;
    paymentType: PaymentType;
    totalPrice: number;
    pickupTime: Date;
    createdDate: Date;
    createdBy: string;
    updatedDate: Date;
    account: AdminAccount;
    orderDetails: AdminOrderDetail[];
    orderStatus: string
}
