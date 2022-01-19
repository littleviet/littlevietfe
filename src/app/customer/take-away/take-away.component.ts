import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { GetTakeAwayProducts, UpdateCart } from 'src/app/actions/take-away.action';
import { TakeAwayState } from 'src/app/states/take-away.state';
import { TimePickerDialogComponent } from 'src/commons/components/time-picker-dialog/time-picker-dialog.component';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';

@Component({
  selector: 'app-take-away',
  templateUrl: './take-away.component.html',
  styleUrls: ['./take-away.component.scss']
})
export class TakeAwayComponent implements OnInit {
  @ViewChild("productTypeNav") productTypeNav!: ElementRef;
  @ViewChild("orderDetail") orderDetail!: ElementRef;
  @ViewChild("orderDetailSection") orderDetailSection!: ElementRef;
  @ViewChild("productList") productList!: ElementRef;
  @ViewChild("productListArea") productListArea!: ElementRef;
  @Select(TakeAwayState.getTakeAwayProducts) takeAwayProducts!: Observable<TakeAwayProduct[]>;
  @Select(TakeAwayState.getCartDetail) cartDetailObs!: Observable<CartDetail>;
  @Select(TakeAwayState.getTimePickUp) timePickUpObs!: Observable<string>;
  @Select(TakeAwayState.getActions) takeAwayActionsObs!: Observable<string[]>;
  cartDetail!: CartDetail;
  menuOpen: boolean = false;
  sticky: boolean = false;
  orderDetailSticky: boolean = false;
  isExpaned: boolean = false;
  products: TakeAwayProduct[] = [];
  selectedProductIndex = 0;
  displayProduct: any;
  timePickUp: string = '';


  constructor(private store: Store, private titleService: Title, public dialog: MatDialog) {
    this.titleService.setTitle("Little Viet - Take Away");
  }

  ngOnInit() {
    this.store.dispatch(new GetTakeAwayProducts());
    this.takeAwayProducts.subscribe((result) => {
      this.products = result;
      this.displayProduct = _.chain(this.products)
        .groupBy(p => p.productTypeId)
        .map((value, key) => ({ productType: key, products: value }))
        .value();
    });

    this.cartDetailObs.subscribe((result) => {
      this.cartDetail = result;
    });

    this.timePickUpObs.subscribe((result) => {
      this.timePickUp = result;
    });

  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (this.productTypeNav && window.pageYOffset > this.productTypeNav.nativeElement.getBoundingClientRect().top) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
      // let orderDetailTop = this.orderDetail.nativeElement.getBoundingClientRect().top;
      // let orderDetailHeight = this.orderDetail.nativeElement.getBoundingClientRect().height;
      // let orderDetailSectionHeight = this.orderDetailSection.nativeElement.getBoundingClientRect().height;
      // let productListHeight = this.productList.nativeElement.getBoundingClientRect().height;
      // let productListTop = this.productList.nativeElement.getBoundingClientRect().top;
      // let productListAreaHeight = this.productList.nativeElement.getBoundingClientRect().height;
      // console.log(`orderDetailTop: ${this.orderDetail.nativeElement.getBoundingClientRect().top},
      //             orderDetailSectionHeight: ${this.orderDetailSection.nativeElement.getBoundingClientRect().height},
      //             productListHeight: ${this.productList.nativeElement.getBoundingClientRect().height}`);
      // if (productListTop < 0) {
      //   console.log("Hello");
      //   this.orderDetailSticky = true;
      // } else {
      //   this.orderDetailSticky = false;
      // }
  }

  clickBtn() {
    this.menuOpen = !this.menuOpen;
  }

  clickProductType(index: number) {
    this.selectedProductIndex = index;
  }

  adjustCart(productId: string , quanity: number) {
    if (!this.timePickUp || this.timePickUp == '') {
      this.openDialog(quanity, productId);
    } else {
      this.store.dispatch(new UpdateCart(quanity, productId));
    }
  }

  openDialog(quantity: number, productId: string): void {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, {
      width: '350px',
      panelClass: 'my-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new UpdateCart(quantity, productId));
      }
    });
  }
}
