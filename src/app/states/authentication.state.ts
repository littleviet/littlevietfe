import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { tap } from 'rxjs';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { AutoLogin, CreateAccount, Login, Logout } from '../actions/authentication.action';
import { AuthService } from '../services/auth.service';

export class AuthenticationStateModel {
    loggedinUser!: LoginAccountInfo | null;
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

    constructor(private authService: AuthService, private store: Store) {
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
            console.log("rhahah", result);
            if (result.success) {
                console.log("hihi: ", result)
                let tempActions = [...state.actions];
                tempActions.splice( tempActions.findIndex(ac => ac == Login.name), 1);
                setState({
                    ...state,
                    loggedinUser: result.payload,
                    actions: tempActions
                });
            }
        },
        ));
    }

    @Action(AutoLogin)
    autoLogin({getState, setState}: StateContext<AuthenticationStateModel>) {
        const state = getState();
    }

    @Action(Logout)
    logout({getState, setState}: StateContext<AuthenticationStateModel>) {
        const state = getState();
        setState({
            ...state,
            loggedinUser: null,
        });
    }

    @Action(CreateAccount)
    createAccount({getState, setState}: StateContext<AuthenticationStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, CreateAccount.name]
        });
        return this.authService.createAccount(payload.regAccountInfo).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new Login({email: payload.regAccountInfo.email, password: payload.regAccountInfo.password}));
            }
            let tempActions = [...state.actions];
            tempActions.splice( tempActions.findIndex(a => a == CreateAccount.name), 1);
            setState({
                ...state,
                actions: tempActions
            });
        }));
    }
}
