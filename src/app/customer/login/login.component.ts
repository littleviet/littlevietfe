import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Login } from 'src/app/actions/authentication.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Select(AuthenticationState.getActions) authActionsObs!: Observable<string[]>;
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;
  loginInfo: LoginAccountInfo | null = null; 
  menuOpen: boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  loginFormGroup = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });


  constructor(private store: Store) { }

  ngOnInit() {
    this.loginAccountInfo.subscribe((result) => {
      this.loginInfo = result;
    });
  }

  onLoginSubmit() {
    this.store.dispatch(new Login(this.loginFormGroup.value));
  }

}
