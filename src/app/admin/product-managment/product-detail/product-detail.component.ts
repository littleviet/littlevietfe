import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminClearProduct, AdminGetProductById, AdminUpdateProduct } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminProduct } from 'src/dtos/product/admin-product';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProduct) productObs!: Observable<AdminProduct>;
  formatterDollar = (value: number): string => `${value} $`;
  parserDollar = (value: string): string => value.replace('$ ', '');
  product!: AdminProduct;
  nameFC = new FormControl("", [Validators.required]);
  esNameFC = new FormControl("", [Validators.required]);
  caNameFC = new FormControl("", [Validators.required]);
  descriptionFC = new FormControl("", [Validators.required]);
  statusFC = new FormControl("", [Validators.required]);
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];

  validateForm: FormGroup = new FormGroup({
    name: this.nameFC,
    caName: this.caNameFC,
    esName: this.esNameFC,
    description: this.descriptionFC,
  });

  constructor(private route: ActivatedRoute, private store: Store) { }

  ngOnInit() {
    this.productObs.subscribe((result) => {
      this.product = result;
      if (this.product != null) {
        this.validateForm.reset();
        this.nameFC.setValue(this.product.name);
        this.caNameFC.setValue(this.product.caName);
        this.esNameFC.setValue(this.product.esName);
        this.descriptionFC.setValue(this.product.description);
        this.galleryImages = this.getImages();
      }
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.store.dispatch(new AdminGetProductById(id));
    }

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
      { "imageArrowsAutoHide": true, "thumbnailsArrowsAutoHide": true },
      { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
      { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 },
    ];
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.product.productImages) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

  submitForm(): void {
    let product = _.clone(this.product);
    product.name = this.nameFC.value;
    product.caName = this.caNameFC.value;
    product.esName = this.esNameFC.value;
    product.description = this.descriptionFC.value;
    this.store.dispatch(new AdminUpdateProduct(product));
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    if (this.product != null) {
      this.nameFC.setValue(this.product.name);
      this.caNameFC.setValue(this.product.caName);
      this.esNameFC.setValue(this.product.esName);
      this.descriptionFC.setValue(this.product.description);
    }
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  onUpdateStatus(status: string) {
    let product = _.clone(this.product);
    product.status = status;
    this.store.dispatch(new AdminUpdateProduct(product));
  }

  ngOnDestroy() {
    this.store.dispatch(new AdminClearProduct());
  }
}
