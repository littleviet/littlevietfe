import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateCart } from 'src/app/actions/take-away.action';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { CartDetail } from 'src/dtos/cart/cart-detail';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit {
  @Input() isCheckout: boolean = false;
  @Select(TakeAwayState.getCartDetail) cartDetailObs!: Observable<CartDetail>;
  totalItem: number = 0;
  cartDetail!: CartDetail;
  orderDetailSticky: boolean = false;
  today = new Date().getDay();
  isCheckoutClick = false;

  constructor(private store: Store) { }

  ngOnInit() {
    this.cartDetailObs.subscribe((result) => {
      this.cartDetail = result;
    });
  }

  adjustCart(servingId: string , quanity: number) {
    this.store.dispatch(new UpdateCart(quanity, servingId))
  }

  isCartEmpty() {
    if (this.cartDetail && this.cartDetail.servings && this.cartDetail.servings.length > 0) {
      this.totalItem = 0;
      this.cartDetail.servings.forEach(pro => {
        this.totalItem += pro.quantity;
      })
    }
    return this.totalItem <= 0;
  }
}
