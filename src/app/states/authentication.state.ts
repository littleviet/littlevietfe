import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { tap } from 'rxjs';
import { Role } from 'src/commons/enums/app-enum';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { AutoLogin, CreateAccount, Login, Logout } from '../actions/authentication.action';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    helper = new JwtHelperService();
    constructor(private authService: AuthService, private store: Store, private router: Router,
        private ngZone: NgZone) { }
    
    ngxsOnInit({getState, setState}: StateContext<AuthenticationStateModel>) {
        const state = getState();
        if (state.loggedinUser != null) {
            let expiredToken = this.helper.getTokenExpirationDate(state.loggedinUser.token);
            if (expiredToken != null) {
                let expirationDuration = expiredToken.getTime() - new Date().getTime();
                if (expirationDuration > 0) {
                    this.authService.setLogoutTimer(expirationDuration);
                } else {
                    this.store.dispatch(new Logout());
                }
            }
        }
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
                let expiredToken = this.helper.getTokenExpirationDate(result.payload.token);
                if (expiredToken != null) {
                    let expirationDuration = expiredToken.getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
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
        this.authService.clearLogoutTimer();
        setState({
            ...state,
            loggedinUser: null,
        });
        
        this.ngZone.run(() => {
            this.router.navigate(['/login']);
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
