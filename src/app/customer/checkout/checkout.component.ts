import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Login } from 'src/app/actions/authentication.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';
import { CartDetail } from 'src/dtos/cart/cart-detail';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Select(AuthenticationState.getLoggedInAccountInfo) loggedInAccountObs!: Observable<LoginAccountInfo>;
  loggedInAccountInfo: LoginAccountInfo | null = null;
  menuOpen: boolean = false;
  checked = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  policyFormControl = new FormControl('', [Validators.required]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  numberFormControl = new FormControl('', [Validators.required]);
  flatDoorFormControl = new FormControl('', [Validators.required]);
  zipCodeFormControl = new FormControl('', [Validators.required]);
  phone1FormControl = new FormControl('', [Validators.required]);
  phone2FormControl = new FormControl('', [Validators.required]);
  regEmailFormControl = new FormControl('', [Validators.required]);
  regPasswordFormControl = new FormControl('', [Validators.required]);

  loginFormGroup = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });

  registerFormGroup = new FormGroup({
    policyFormControl: this.policyFormControl,
    firstNameFormControl: this.firstNameFormControl,
    lastNameFormControl: this.lastNameFormControl,
    addressFormControl: this.addressFormControl,
    numberFormControl: this.numberFormControl,
    flatDoorFormControl: this.flatDoorFormControl,
    zipCodeFormControl: this.zipCodeFormControl,
    phone1FormControl: this.phone1FormControl,
    phone2FormControl: this.phone2FormControl,
    regEmailFormControl: this.regEmailFormControl,
    regPasswordFormControl: this.regPasswordFormControl,
  });

  constructor(private store: Store, private titleService: Title) {
    this.titleService.setTitle("Little Viet - Checkout");
  }

  cartDetail: CartDetail = {
    totalPrice: 50,
    subTotalPrice: 45,
    products: [
      {
        name: 'Banh mi 1 ',
        esName: 'Banh mi 1',
        caName: 'Banh mi 1',
        price: 6.5,
        id: '1',
        quantity: 10
      },
      {
        name: 'Banh mi 2',
        esName: 'Banh mi 2',
        caName: 'Banh mi 2',
        price: 6.5,
        id: '1',
        quantity: 6
      },
      {
        name: 'Banh mi 3',
        esName: 'Banh mi 3',
        caName: 'Banh mi 3',
        price: 6.5,
        id: '2',
        quantity: 6
      },
      {
        name: 'Banh mi 4',
        esName: 'Banh mi 4',
        caName: 'Banh mi 4',
        price: 6.5,
        id: '2',
        quantity: 7
      },
    ]
  };

  ngOnInit() {
    this.loggedInAccountObs.subscribe((result) => {
      this.loggedInAccountInfo = result;
    });
  }

  onLoginSubmit() {
    this.store.dispatch(new Login(this.loginFormGroup.value));
  }
}
