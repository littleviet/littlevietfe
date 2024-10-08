import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CreateAccount } from 'src/app/actions/authentication.action';
import { AuthenticationState } from 'src/app/states/authentication.state';
import { LoginAccountInfo } from 'src/dtos/account/login-account-info';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @ViewChild('header') headerEl!: ElementRef;
  @ViewChild('footer') footerEl!: ElementRef;
  @ViewChild('full') fullEl!: ElementRef;
  @ViewChild('menuBtn', { static: true }) menuEl!: ElementRef;
  @Select(AuthenticationState.getActions) authActionsObs!: Observable<string[]>;
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfoObs!: Observable<LoginAccountInfo>;

  isViewInit = false;
  scrHeight: number = 0;
  footerHeight: number = 0;
  menuOpen: boolean = false;
  loginInfo: LoginAccountInfo | null = null; 

  // Register control
  policyFormControl = new FormControl('', [Validators.required]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  numberFormControl = new FormControl('', [Validators.required]);
  flatDoorFormControl = new FormControl('', [Validators.required]);
  zipCodeFormControl = new FormControl('', [Validators.required]);
  phone1FormControl = new FormControl('', [Validators.required]);
  phone2FormControl = new FormControl('');
  regEmailFormControl = new FormControl('', [Validators.required]);
  regPasswordFormControl = new FormControl('', [Validators.required]);
  newsLetterFormControl = new FormControl();

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

  constructor(private store: Store, private cdRef : ChangeDetectorRef,
    private renderer: Renderer2) {
      this.renderer.listen('window', 'click', (e: any) => {
        if (!this.menuEl.nativeElement.contains(e.target)) {
          if (this.menuOpen) {
            this.menuOpen = false;
          }
        }
      });
    }

  ngOnInit() {
    this.loginAccountInfoObs.subscribe((result) => {
      this.loginInfo = result;
    });
  }

  onRegisterSubmit() {
    this.store.dispatch(new CreateAccount(this.registerFormGroup.value));
  }

  ngAfterViewInit() {
    this.getScreenSize();
  }

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
    this.isViewInit = true;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    if (this.isViewInit && this.headerEl != null && this.fullEl != null && this.footerEl != null) {
      if (this.fullEl.nativeElement.getBoundingClientRect().height > window.innerHeight) {
        return;
      } else {
        this.scrHeight = window.innerHeight - this.headerEl.nativeElement.getBoundingClientRect().height
        - this.footerEl.nativeElement.getBoundingClientRect().height;
      }
    }
  }
}
