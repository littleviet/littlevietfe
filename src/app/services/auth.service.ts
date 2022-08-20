import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { Store } from '@ngxs/store';
import { Logout } from '../actions/authentication.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private store: Store) {
    }

    login(email: string, password: string) : Observable<BaseResponse<LoginAccountInfo>> {
        return this.http.post<BaseResponse<LoginAccountInfo>>(environment.apiUrl + 'account/login', {
            email: email,
            password: password
        });
    }

    createAccount(accountInfo: any) : Observable<BaseResponse<object>> {
        let account = {...accountInfo, accountType: 3}
        return this.http.post<BaseResponse<LoginAccountInfo>>(environment.apiUrl + 'account/register', account);
    }

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new Logout());
        }, expirationDuration);
    }
    
    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}