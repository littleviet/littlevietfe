import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    login(email: string, password: string) : Observable<BaseResponse<LoginAccountInfo>> {
        console.log(email, password);
        return this.http.post<BaseResponse<LoginAccountInfo>>(environment.apiUrl + 'account/login', {
            email: email,
            password: password
        });
    }
}