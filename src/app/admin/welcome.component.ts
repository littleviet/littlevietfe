import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { Logout } from '../actions/authentication.action';
import { AuthenticationState } from '../states/authentication.state';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  constructor(private store: Store, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.router.url.split('/').length < 3) {
      this.router.navigate([`/admin/products`], { queryParams: { pageNumber: '1', pageSize: '10'}});
    }
    
    this.loginAccountInfo.subscribe((result) => {
      this.loginInfo = result;
    });
  }

  logout() {
    this.store.dispatch(new Logout());
  }

}
