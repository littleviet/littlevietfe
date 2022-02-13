import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CustomerCouponType } from 'src/dtos/coupon-type/customer-coupon-type';
import { CustomerCouponRequest } from 'src/dtos/coupon/customer-coupon-request';
import { CheckoutPaymentResponse } from 'src/dtos/cart/check-out-payment-response';

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    constructor(private http: HttpClient) {
    }

    getCouponTypes() : Observable<BaseResponse<CustomerCouponType[]>> {
        return this.http.get<BaseResponse<CustomerCouponType[]>>(environment.apiUrl + 'coupon-type');
    }

    buyCoupon(couponRequest: CustomerCouponRequest) : Observable<BaseResponse<CheckoutPaymentResponse>> {
        return this.http.post<BaseResponse<CheckoutPaymentResponse>>(environment.apiUrl + 'coupon',
            couponRequest
        );
    }
}