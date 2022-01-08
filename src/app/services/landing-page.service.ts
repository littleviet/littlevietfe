import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';

@Injectable({
    providedIn: 'root'
})
export class LandingPageService {

    constructor(private http: HttpClient) {
    }

    getProductMenu() : Observable<BaseResponse<CustomerProductType[]>> {
        return this.http.get<BaseResponse<CustomerProductType[]>>(environment.apiUrl + 'landing-page/products');
    }
}