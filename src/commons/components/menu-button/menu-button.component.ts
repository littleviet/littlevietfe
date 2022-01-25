import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from 'src/app/actions/authentication.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
  @Input() isDisplayBackground: boolean = false
  @Output() isMenuOpen: EventEmitter<boolean> = new EventEmitter();
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  menuOpen: boolean = false;
  constructor(private store: Store) { }

  ngOnInit() {
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
    this.isMenuOpen.emit(this.menuOpen);

    this.loginAccountInfo.subscribe((result) => {
      this.loginInfo = result;
    });
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
