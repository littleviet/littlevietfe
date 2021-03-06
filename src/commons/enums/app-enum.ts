export enum ReservationStatus {
    Reserved = 1,
    Cancelled,
    Completed,
}

export enum Role
{
    ADMIN = 1,
    MANAGER = 2,
    AUTHORIZED = 3,
    UNAUTHORIZED = 4
}

export enum OrderType
{
    EatIn = 1,
    TakeAway = 2,
}

export enum PaymentType
{
    Stripe = 1,
}

export enum ProductStatus {
  INSTOCK = 1,
  OUTOFSTOCK = 2
}

export enum OrderStatus {
    Ordered = 1,
    Paid = 2,
    Cancelled = 3,
    Expired = 4,
    PickedUp = 5
}
