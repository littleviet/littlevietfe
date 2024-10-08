import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('footer') footerEl!: ElementRef;
  @ViewChild('menuBtn', { static: true }) menuEl!: ElementRef;
  @Select(TakeAwayState.getTakeAwayProducts) takeAwayProducts!: Observable<TakeAwayProduct[]>;
  @Select(TakeAwayState.getCartDetail) cartDetailObs!: Observable<CartDetail>;
  @Select(TakeAwayState.getTimePickUp) timePickUpObs!: Observable<string>;
  @Select(TakeAwayState.getActions) takeAwayActionsObs!: Observable<string[]>;

  footerHeight: number = 0;
  cartDetail!: CartDetail;
  menuOpen: boolean = false;
  sticky: boolean = false;
  orderDetailSticky: boolean = false;
  isExpaned: boolean = false;
  selectedProductIndex = 0;
  displayProduct: any;
  timePickUp: string = '';
  products: TakeAwayProduct[] = [];

  constructor(private store: Store, private titleService: Title, public dialog: MatDialog,
    private cdRef : ChangeDetectorRef, private renderer: Renderer2) {
    this.titleService.setTitle("Little Viet - Take Away");
    this.renderer.listen('window', 'click', (e: any) => {
      if (!this.menuEl.nativeElement.contains(e.target)) {
        if (this.menuOpen) {
          this.menuOpen = false;
        }
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetTakeAwayProducts());
    this.takeAwayProducts.subscribe((result) => {
      this.products = result;
      this.displayProduct = _.chain(this.products)
        .filter(pro => pro.servings && pro.servings.length > 0)
        .groupBy(p => p.productType.name)
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
  }

  clickProductType(index: number) {
    this.selectedProductIndex = index;
  }

  adjustCart(servingId: string , quanity: number) {
    if (!this.timePickUp || this.timePickUp == '') {
      this.openDialog(quanity, servingId);
    } else {
      this.store.dispatch(new UpdateCart(quanity, servingId));
    }
  }

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
  }

  openDialog(quantity: number, productId: string): void {
    const dialogRef = this.dialog.open(TimePickerDialogComponent, {
      width: '350px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new UpdateCart(quantity, productId));
      }
    });
  }
}
