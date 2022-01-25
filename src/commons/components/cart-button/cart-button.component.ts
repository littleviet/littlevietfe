import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { CartDetail } from 'src/dtos/cart/cart-detail';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss']
})
export class CartButtonComponent implements OnInit {
  @Select(TakeAwayState.getCartDetail) cartDetailObs!: Observable<CartDetail>;
  totalItem: number = 0;
  cartDetail: CartDetail | null = null;
  constructor() { }

  ngOnInit() {
    this.cartDetailObs.subscribe((result) => {
      this.cartDetail = result;
      if (this.cartDetail && this.cartDetail.servings && this.cartDetail.servings.length > 0) {
        this.totalItem = 0;
        this.cartDetail.servings.forEach(pro => {
          this.totalItem += pro.quantity;
        })
      }
    });
  }

}
