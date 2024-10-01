import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCouponTypes, UpdateCouponBuyingInfo } from 'src/app/actions/coupon.action';
import { CouponState } from 'src/app/states/coupon.state';
import { CustomerCouponType } from 'src/dtos/coupon-type/customer-coupon-type';
import { CouponConfirmDialogComponent } from './coupon-confirm-dialog/coupon-confirm-dialog.component';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @ViewChild('header') headerEl!: ElementRef;
  @ViewChild('footer') footerEl!: ElementRef;
  @ViewChild('full') fullEl!: ElementRef;
  @ViewChild('menuBtn', { static: true }) menuEl!: ElementRef;
  @Select(CouponState.getCouponTypes) couponTypesObs!: Observable<CustomerCouponType[]>;
  @Select(CouponState.isCouponBuyingSuccess) couponBuyingSuccessObs!: Observable<boolean | null>;
  
  isViewInit = false;
  scrHeight: number = 0;
  footerHeight: number = 0;
  couponBuyingSuccess: boolean | null = null;
  couponTypes: CustomerCouponType[] = [];
  numberOfUnit = Array(10).fill(0);
  couponTypeFC = new FormControl("", [Validators.required]);
  unitFC = new FormControl(1, [Validators.required]);
  couponFG = new FormGroup({
    couponTypeId: this.couponTypeFC,
    unit: this.unitFC,
  });
  menuOpen: boolean = false;

  constructor(private store: Store, public dialog: MatDialog,
    private cdRef : ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.store.dispatch(new GetCouponTypes());

    this.couponTypesObs.subscribe((result) => {
      this.couponTypes = result;
      if (this.couponTypes != null && this.couponTypes.length > 0) {
        this.couponTypeFC.setValue(this.couponTypes[0].id);
      }
    });

    this.couponBuyingSuccessObs.subscribe((result) => {
      this.couponBuyingSuccess = result;
    });

    this.renderer.listen('window', 'click', (e: any) => {
      if (e.path?.indexOf(this.menuEl.nativeElement) === -1) {
        if (this.menuOpen) {
          this.menuOpen = false;
        }
      }
    });
  }

  openDialog(): void {
    this.store.dispatch(new UpdateCouponBuyingInfo(this.couponFG.value));
    const dialogRef = this.dialog.open(CouponConfirmDialogComponent, {
      width: '1200px',
      panelClass: 'my-dialog',
      maxHeight: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.couponBuyingSuccess != null) {
        // this.store.dispatch(new ClearReservation());
      }
    });
  }

  ngAfterViewInit() {
    this.getScreenSize();
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    this.footerHeight = this.footerEl.nativeElement.getBoundingClientRect().height;
    this.cdRef.detectChanges();
    this.isViewInit = true;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    if (this.isViewInit && this.headerEl != null && this.fullEl.nativeElement.getBoundingClientRect().height <= window.innerHeight) {
      this.scrHeight = window.innerHeight - this.headerEl.nativeElement.getBoundingClientRect().height
        - this.footerEl.nativeElement.getBoundingClientRect().height;
    }
  }
}
