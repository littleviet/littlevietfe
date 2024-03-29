import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';
import { CheckoutPaymentResponse } from 'src/dtos/cart/check-out-payment-response';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { CusReservation } from 'src/dtos/reservation/cus-reservation';

@Injectable({
    providedIn: 'root'
})
export class TakeAwayService {

    constructor(private http: HttpClient) {
    }

    getTakeAwayProductMenu() : Observable<BaseResponse<TakeAwayProduct[]>> {
        return this.http.get<BaseResponse<TakeAwayProduct[]>>(environment.apiUrl + 'take-away/menu');
    }

    checkOutCart(pickupTime: any, cartDetail: CartDetail) : Observable<BaseResponse<CheckoutPaymentResponse>> {
        return this.http.post<BaseResponse<CheckoutPaymentResponse>>(environment.apiUrl + 'order',
            {
                orderType: 2,
                paymentType: 1,
                pickupTime: new Date(pickupTime.time),
                totalPrice: cartDetail.totalPrice,
                orderDetails: cartDetail.servings.map(serving => ({servingId: serving.id, quantity: serving.quantity}))
            }
        );
    }

    bookReservation(reservation: CusReservation) : Observable<BaseResponse<CheckoutPaymentResponse>> {
        let date = reservation.day;
        date.setHours(parseInt(reservation.hour.substring(0, 2)));
        date.setMinutes(parseInt(reservation.hour.substring(3)));
        date.setSeconds(0);
        date.setMilliseconds(0);

        return this.http.post<BaseResponse<CheckoutPaymentResponse>>(environment.apiUrl + 'reservation',
            {
                firstName: reservation.firstName,
                lastName: reservation.lastName,
                email: reservation.email,
                furtherRequest: reservation.furtherRequest,
                noOfPeople: reservation.noOfPeople,
                bookingDate: new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()} ${this.getTimeZone('Europe/Madrid')}`),
                phoneNumber: reservation.phoneNumber
            }
        );
    }

    getTimeZone(timeZone: string) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            formatMatcher: "basic",
            timeZoneName: "short"
          });
        
          let offset = formatter.formatToParts().find(part => part.type == "timeZoneName")?.value;

          return offset;
      }
}
