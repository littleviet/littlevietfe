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
  @Input() titleBtn: string = "CHECK OUT";
  @Select(TakeAwayState.getCartDetail) cartDetailObs!: Observable<CartDetail>;
  totalItem: number = 0;
  cartDetail!: CartDetail;
  orderDetailSticky: boolean = false;
  constructor(private store: Store) { }

  ngOnInit() {
    this.cartDetailObs.subscribe((result) => {
      this.cartDetail = result;
    });
  }

  adjustCart(productId: string , quanity: number) {
    this.store.dispatch(new UpdateCart(quanity, productId))
  }

  isCartEmpty() {
    if (this.cartDetail && this.cartDetail.products && this.cartDetail.products.length > 0) {
      this.totalItem = 0;
      this.cartDetail.products.forEach(pro => {
        this.totalItem += pro.quantity;
      })
    }
    return this.totalItem <= 0;
  }
}
