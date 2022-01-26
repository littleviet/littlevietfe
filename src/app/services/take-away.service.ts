import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';
import { CheckoutCartResponse } from 'src/dtos/cart/check-out-cart-response';
import { CartDetail } from 'src/dtos/cart/cart-detail';

@Injectable({
    providedIn: 'root'
})
export class TakeAwayService {

    constructor(private http: HttpClient) {
    }

    getTakeAwayProductMenu() : Observable<BaseResponse<TakeAwayProduct[]>> {
        return this.http.get<BaseResponse<TakeAwayProduct[]>>(environment.apiUrl + 'product?pageSize=50');
    }

    checkOutCart(pickupTime: string, cartDetail: CartDetail) : Observable<BaseResponse<CheckoutCartResponse>> {
        return this.http.post<BaseResponse<CheckoutCartResponse>>(environment.apiUrl + 'order',
            {
                orderType: 1,
                paymentType: 1,
                pickupTime: "2022-01-25T15:29:15.935Z",
                totalPrice: cartDetail.totalPrice,
                orderDetails: cartDetail.servings.map(serving => ({servingId: serving.id, quantity: serving.quantity}))
            }
        );
    }
}