import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CreateAccount, Login } from 'src/app/actions/authentication.action';
import { CheckOutCart, GetTakeAwayProducts, UpdatePickUpTime } from 'src/app/actions/take-away.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  @Select(AuthenticationState.getLoggedInAccountInfo) loggedInAccountObs!: Observable<LoginAccountInfo>;
  @Select(AuthenticationState.getActions) authActionsObs!: Observable<string[]>;
  @Select(TakeAwayState.getActions) takeAwayActionsObs!: Observable<string[]>;
  @Select(TakeAwayState.isCartEmpty) isCartEmptyObs!: Observable<boolean>;
  @Select(TakeAwayState.getTimePickUp) pickUptimeObs!: Observable<any>;
  loggedInAccountInfo: LoginAccountInfo | null = null;
  menuOpen: boolean = false;
  checked = false;
  orderSuccess: boolean | null = null;
  pickUpTime: Date | null = null;
  pickUpTimeValues: any[] = [];
  // Login control
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  // Register control
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
  newsLetterFormControl = new FormControl();

  loginFormGroup = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });

  registerFormGroup = new FormGroup({
    policy: this.policyFormControl,
    newsLetter: this.newsLetterFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    address: this.addressFormControl,
    number: this.numberFormControl,
    flatDoor: this.flatDoorFormControl,
    zipCode: this.zipCodeFormControl,
    phoneNumber1: this.phone1FormControl,
    phoneNumber2: this.phone2FormControl,
    email: this.regEmailFormControl,
    password: this.regPasswordFormControl,
  });

  // payment form control
  hourFormControl = new FormControl('', [Validators.required]);
  dinnersFormControl = new FormControl('', [Validators.required]);
  paymentMethodFormControl = new FormControl('', [Validators.required]);
  additionalRequestFormControl = new FormControl('');

  submitPay = new FormGroup({
    hours: this.hourFormControl,
    paymentMethod: this.paymentMethodFormControl,
    dinners: this.dinnersFormControl,
    additionalRequest: this.additionalRequestFormControl,
  });

  constructor(private store: Store, private titleService: Title, private router: Router) {
    this.titleService.setTitle("Little Viet - Checkout");
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url == '/checkout/order-successful') {
          this.orderSuccess = true;
        } else if (val.url == '/checkout/order-canceled') {
          this.orderSuccess = false;
        }
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetTakeAwayProducts());
    this.loggedInAccountObs.subscribe((result) => {
      this.loggedInAccountInfo = result;
    });
    this.pickUptimeObs.subscribe((result) => {
      if (result != null) {
        this.pickUpTime = new Date(result.time);
        this.hourFormControl.setValue(this.pickUpTime);
      }
    });
    this.hourFormControl.valueChanges.subscribe((v) => {
      if (v != this.pickUpTime) {
        this.store.dispatch(new UpdatePickUpTime(v));
      }
    });
    this.generateTimeValues();
  }

  onLoginSubmit() {
    this.store.dispatch(new Login(this.loginFormGroup.value));
  }

  onRegisterSubmit() {
    this.store.dispatch(new CreateAccount(this.registerFormGroup.value));
  }

  onPaySubmit() {
    this.store.dispatch(new CheckOutCart(this.submitPay.value));
  }

  getDay() {
    var date = new Date();
    return this.daysOfWeek[date.getDay()];
  }

  generateTimeValues() {
    var date = new Date();
    let startMinute = 0;

    switch(true) { 
      case (date.getMinutes() >= 45):
        startMinute = 0;
        date.setHours(date.getHours() + 1);
        break; 
      case (date.getMinutes() >= 30):
        startMinute = 45;
        break; 
      case (date.getMinutes() >= 15):
        startMinute = 30;
        break; 
      case (date.getMinutes() >= 0):
        startMinute = 15;
        break; 
      default:
        break;
    }

    date.setMinutes(startMinute);
    date.setSeconds(0);
    while (date.getHours() < 23) {
      if ((date.getHours() >= 13 && date.getHours() < 16) || (date.getHours() >= 20 && date.getHours() < 23)) {
        this.pickUpTimeValues.push(new Date(date));
      }
      date.setMinutes(date.getMinutes() + 15);
    }
  }
}
