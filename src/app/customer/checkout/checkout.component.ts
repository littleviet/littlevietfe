import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { CartDetail } from 'src/dtos/cart/cart-detail';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  menuOpen: boolean = false;
  checked = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  policyFormControl = new FormControl('', [Validators.required]);

  loginFormGroup = new FormGroup({
    emailFormControl: this.emailFormControl,
    passwordFormControl: this.passwordFormControl,
  });

  registerFormGroup = new FormGroup({
    policyFormControl: this.policyFormControl,
    emailFormControl: this.emailFormControl,
    passwordFormControl: this.passwordFormControl,
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
  }

}
