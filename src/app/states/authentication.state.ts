import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { tap } from 'rxjs';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { AutoLogin, Login } from '../actions/authentication.action';
import { AuthService } from '../services/auth.service';

export class AuthenticationStateModel {
    loggedinUser!: LoginAccountInfo;
    actions!: string[];
}

@State<AuthenticationStateModel>({
    name: 'authentication',
    defaults: {
        loggedinUser: new LoginAccountInfo(),
        actions: []
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

    @Selector()
    static getActions(state: AuthenticationStateModel) {
        return state.actions;
    }

    @Action(Login)
    login({getState, setState}: StateContext<AuthenticationStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, Login.name]
        });
        return this.authService.login(payload.loginInfo.email, payload.loginInfo.password).pipe(tap((result) => {
            if (result.success) {
                // localStorage.setItem("loginAccountInfo", JSON.stringify(result.payload));
                let tempActions = [...state.actions];
                tempActions.splice( tempActions.findIndex(a => a == Login.name), 1);
                setState({
                    ...state,
                    loggedinUser: result.payload,
                    actions: tempActions
                });
            }
        }));
    }

    @Action(AutoLogin)
    autoLogin({getState, setState}: StateContext<AuthenticationStateModel>) {
        const state = getState();
        // let userInfo = localStorage.getItem("loginAccountInfo");
        // if (userInfo != null) {
        //     let jsonObj: any = JSON.parse(userInfo);
        //     let loginAccountInfo: LoginAccountInfo = <LoginAccountInfo>jsonObj;
        //     setState({
        //         ...state,
        //         loggedinUser: loginAccountInfo
        //     });
        // }
    }
}
