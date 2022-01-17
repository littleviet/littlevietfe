import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, tap } from 'rxjs';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { BaseResponse } from 'src/dtos/base-response';
import { AutoLogin, Login } from '../actions/authentication.action';
import { GetTakeAwayProducts, UpdateCart } from '../actions/take-away.action';
import { AuthService } from '../services/auth.service';

export class AuthenticationStateModel {
    loggedinUser!: LoginAccountInfo;
}

@State<AuthenticationStateModel>({
    name: 'authentication',
    defaults: {
        loggedinUser: new LoginAccountInfo(),
    }
})

@Injectable()
export class AuthenticationState {

    constructor(private authService: AuthService) {
    }

    @Selector()
    static getLoggedInAccountInfo(state: AuthenticationStateModel) {
        return state.loggedinUser;
    }

    @Action(Login)
    login({getState, setState}: StateContext<AuthenticationStateModel>, payload: any) {
        console.log("padloaddd: ", payload)
        return this.authService.login(payload.loginInfo.email, payload.loginInfo.password).pipe(tap((result) => {
            const state = getState();
            if (result.success) {
                setState({
                    ...state,
                    loggedinUser: result.payload
                });
                localStorage.setItem("loginAccountInfo", JSON.stringify(result.payload));
            }
        }));
    }

    @Action(AutoLogin)
    autoLogin({getState, setState}: StateContext<AuthenticationStateModel>) {
        const state = getState();
        var loginAccount = new LoginAccountInfo();
        let userInfo = localStorage.getItem("loginAccountInfo");
        if (userInfo != null) {
            let jsonObj: any = JSON.parse(userInfo);
            let loginAccountInfo: LoginAccountInfo = <LoginAccountInfo>jsonObj;
            setState({
                ...state,
                loggedinUser: loginAccountInfo
            });
        }
    }
}
