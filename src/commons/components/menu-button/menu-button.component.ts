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
  @Input() isDisplayBackground: boolean = false;
  @Input() menuOpen: boolean = false;
  @Output() menuOpenChange: EventEmitter<boolean> = new EventEmitter();
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  constructor(private store: Store) { }

  ngOnInit() {
    this.loginAccountInfo.subscribe((result) => {
      this.loginInfo = result;
    });
  }

  closeMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
  }

  menuClick() {
    let width = window.innerWidth;
    if (width <= 991 && this.menuOpen) {
      this.menuOpen = false;
    }
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
