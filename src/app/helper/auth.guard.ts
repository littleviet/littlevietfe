import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  ActivatedRoute
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { AuthenticationState } from '../states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { Role } from 'src/commons/enums/app-enum';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  @Select(AuthenticationState.getLoggedInAccountInfo) loggedInAccountObs!: Observable<LoginAccountInfo>;
  constructor(private router: Router, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.loggedInAccountObs.pipe(
      take(1),
      map(loginInfo => {
        if (state.url.includes('admin')) {
          if (loginInfo != null && (loginInfo.accountType.toString() == Role[Role.ADMIN] || loginInfo.accountType.toString()  == Role[Role.MANAGER])) {
            return true;
          }
        } else {
          if (loginInfo != null && (loginInfo.accountType.toString() == Role[Role.ADMIN] || loginInfo.accountType.toString()  == Role[Role.MANAGER])) {
            return this.router.createUrlTree(['/admin']);
          }
        }
        
        
        return this.router.createUrlTree(['']);
      })
    );
  }
}
