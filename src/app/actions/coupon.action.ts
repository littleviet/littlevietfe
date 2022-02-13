export class GetCouponTypes {
    static readonly type = '[COUPON] Get Coupon Types'
}

export class UpdateCouponBuyingInfo {
    static readonly type = '[COUPON] Update Coupon Buying Info'
    constructor(public couponBuyingInfo: any) {
    }
}

export class CheckoutCoupon {
    static readonly type = '[COUPON] Checkout Coupon'
    constructor(public couponBuyerInfo: any) {
    }
}