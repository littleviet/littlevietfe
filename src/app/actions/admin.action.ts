import { AdminOrderQueryRequest } from "src/dtos/order/admin-order-query-request";
import { AdminProductType } from "src/dtos/product-type/admin-product-type";
import { AdminProductTypeQueryRequest } from "src/dtos/product-type/admin-product-type-query-request";
import { AdminProduct } from "src/dtos/product/admin-product";
import { AdminProductQueryRequest } from "src/dtos/product/admin-product-query-request";
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
  constructor(public product: AdminProduct) {};
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

export class AdminCreateProductType {
  static readonly type = '[ADMIN] Admin Create Product Type';
  constructor(public productType: AdminProductType) {};
}
