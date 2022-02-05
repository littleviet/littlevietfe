import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { tap } from 'rxjs';
import { Role } from 'src/commons/enums/app-enum';
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

    constructor(private authService: AuthService, private store: Store, private router: Router,
        private ngZone: NgZone) { }

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
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(ac => ac == Login.name), 1);
        return this.authService.login(payload.loginInfo.email, payload.loginInfo.password).pipe(tap((result) => {
            if (result.success) {
                if (result.payload.accountType.toString() == Role[Role.ADMIN]
                    || result.payload.accountType.toString() == Role[Role.MANAGER]) {
                    this.ngZone.run(() => {
                        this.router.navigate(['/admin/']);
                    });
                }
                setState({
                    ...state,
                    loggedinUser: result.payload,
                    actions: tempActions
                });
            } else {
                setState({
                    ...state,
                    actions: tempActions
                });
            }
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
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
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == CreateAccount.name), 1);
        return this.authService.createAccount(payload.regAccountInfo).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new Login({email: payload.regAccountInfo.email, password: payload.regAccountInfo.password}));
            }
            
            setState({
                ...state,
                actions: tempActions
            });
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
    }
}
