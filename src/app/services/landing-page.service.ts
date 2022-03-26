import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { LandingPageModel } from 'src/dtos/landing-page/landing-page-model';

@Injectable({
    providedIn: 'root'
})
export class LandingPageService {

    constructor(private http: HttpClient) {
    }

    getLandingPageProduct() : Observable<BaseResponse<LandingPageModel>> {
        return this.http.get<BaseResponse<LandingPageModel>>(environment.apiUrl + 'landing-page/products');
    }
}
