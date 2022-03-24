import { CouponQueryRequest } from "src/dtos/coupon/coupon-query-request";
import { AdminOrderQueryRequest } from "src/dtos/order/admin-order-query-request";
import { AdminProductType } from "src/dtos/product-type/admin-product-type";
import { AdminProductTypeQueryRequest } from "src/dtos/product-type/admin-product-type-query-request";
import { AdminProductQueryRequest } from "src/dtos/product/admin-product-query-request";
import { AdminUpdateProductRequest } from "src/dtos/product/admin-update-product-request";
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

export class AdminGetProducts {
  static readonly type = '[ADMIN] Admin Get Products';
  constructor(public query: AdminProductQueryRequest) {}
}

export class AdminGetProductById {
  static readonly type = '[ADMIN] Admin Get Product By Id';
  constructor(public id: string) {}
}

export class AdminClearProduct {
  static readonly type = '[ADMIN] Admin Clear Product';
  constructor() {};
}

export class AdminUpdateProduct {
  static readonly type = '[ADMIN] Admin Update Product';
  constructor(public product: AdminUpdateProductRequest) {};
}

export class AdminUpdateMainProductImage {
  static readonly type = '[ADMIN] Admin Update Main Product Image';
  constructor(public imageId: string) {};
}

export class AdminUploadProductImage {
  static readonly type = '[ADMIN] Admin Upload Product Image';
  constructor(public data: FormData) {};
}

export class AdminDeleteProductImage {
  static readonly type = '[ADMIN] Admin Delete Product Image';
  constructor(public imageId: string) {};
}

export class AdminCreateProduct {
  static readonly type = '[ADMIN] Admin Create Product';
  constructor(public data: any) {};
}

// For dropdown value in create new product
export class AdminGetAllProductTypes {
  static readonly type = '[ADMIN] Admin Get All ProductTypes';
  constructor() {}
}

export class AdminGetProductTypes {
  static readonly type = '[ADMIN] Admin Get ProductTypes';
  constructor(public query: AdminProductTypeQueryRequest) {}
}

export class AdminGetProductTypeById {
  static readonly type = '[ADMIN] Admin Get Product Type By Id';
  constructor(public id: string) {}
}

export class AdminClearProductType {
  static readonly type = '[ADMIN] Admin Clear Product Type';
  constructor() {};
}

export class AdminUpdateProductType {
  static readonly type = '[ADMIN] Admin Update Product Type';
  constructor(public productType: AdminProductType) {};
}

export class SearchPickUpOrders {
  static readonly type = '[ADMIN] Search Pick Up Orders';
  constructor(public query: AdminOrderQueryRequest) {}
}

export class SearchUseCoupons {
  static readonly type = '[ADMIN] Search Use Coupons';
  constructor(public query: CouponQueryRequest) {}
}

export class SearchPickUpOrderById {
  static readonly type = '[ADMIN] Search Pick Up Order By Id';
  constructor(public id: string) {}
}

export class SearchReservationOrders {
  static readonly type = '[ADMIN] Search Reservation Orders';
  constructor(public query: AdminReservationQueryRequest) {}
}

export class SearchReservationOrderById {
  static readonly type = '[ADMIN] Search Reservation Order By Id';
  constructor(public id: string) {}
}

export class AdminCreateProductType {
  static readonly type = '[ADMIN] Admin Create Product Type';
  constructor(public productType: AdminProductType) {};
}

export class AdminUpdateServing {
  static readonly type = '[ADMIN] Admin Update Serving';
  constructor(public data: any) {};
}

export class AdminAddServing {
  static readonly type = '[ADMIN] Admin Add Serving';
  constructor(public data: any) {};
}

export class AdminDeleteServing {
  static readonly type = '[ADMIN] Admin Delete Serving';
  constructor(public servingId: string) {};
}

export class AdminCompletePickUpOrder {
  static readonly type = '[ADMIN] Admin Complete Pick Up Order';
  constructor(public orderId: string) {};
}

export class AdminCheckInReservation {
  static readonly type = '[ADMIN] Admin Check In Reservation';
  constructor(public reservationId: string) {};
}

export class AdminUseCoupon {
  static readonly type = '[ADMIN] Admin Use Coupon';
  constructor(public useCouponInfo: any) {};
}
