import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';

@Injectable({
    providedIn: 'root'
})
export class TakeAwayService {

    constructor(private http: HttpClient) {
    }

    getTakeAwayProductMenu() : Observable<BaseResponse<TakeAwayProduct[]>> {
        return this.http.get<BaseResponse<TakeAwayProduct[]>>(environment.apiUrl + 'product');
    }
}