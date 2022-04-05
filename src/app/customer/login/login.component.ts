import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('header') headerEl!: ElementRef;
  @ViewChild('footer') footerEl!: ElementRef;
  @ViewChild('full') fullEl!: ElementRef;
  @ViewChild('menuBtn', { static: true }) menuEl!: ElementRef;
  @Select(AuthenticationState.getActions) authActionsObs!: Observable<string[]>;
  @Select(AuthenticationState.getLoggedInAccountInfo) loginAccountInfo!: Observable<LoginAccountInfo>;

  loginInfo: LoginAccountInfo | null = null; 
  menuOpen: boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  scrHeight: number = 0;
  footerHeight: number = 0;
  loginFormGroup = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });

  constructor(private store: Store, private cdRef : ChangeDetectorRef, private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: any) => {
      if (e.path.indexOf(this.menuEl.nativeElement) === -1) {
        if (this.menuOpen) {
          this.menuOpen = false;
        }
      }
    });
  }

  ngOnInit() {
    this.loginAccountInfo.subscribe((result) => {
      if (this.loginInfo != result) {
        this.getScreenSize();
      }
      this.loginInfo = result;
    });
  }

  ngAfterViewInit() {
    this.getScreenSize();
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
  }

  onLoginSubmit() {
    this.store.dispatch(new Login(this.loginFormGroup.value));
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    if (this.headerEl != null && this.fullEl.nativeElement.getBoundingClientRect().height <= window.innerHeight) {
      this.scrHeight = window.innerHeight - this.headerEl.nativeElement.getBoundingClientRect().height
        - this.footerEl.nativeElement.getBoundingClientRect().height;
    }
  }
}
