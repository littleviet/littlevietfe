import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminAddServing, AdminClearProduct, AdminDeleteProductImage, AdminDeleteServing, AdminGetAllProductTypes, AdminGetProductById,
  AdminUpdateMainProductImage, AdminUpdateProduct, AdminUpdateServing, AdminUploadProductImage }
  from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminProduct } from 'src/dtos/product/admin-product';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AdminUpdateProductRequest } from 'src/dtos/product/admin-update-product-request';
import { AdminProductType } from 'src/dtos/product-type/admin-product-type';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProduct) productObs!: Observable<AdminProduct>;
  @Select(AdminState.getAllProductTypes) allProductTypesObs!: Observable<AdminProductType[]>;
  allProductTypes: AdminProductType[] = [];
  formatterPeople = (value: number): string => `${value} Pip`;
  parserPeople = (value: string): string => value.replace(' Pip', '');
  formatterEuro = (value: number): string => `${value} €`;
  parserEuro = (value: string): string => value.replace(' €', '');
  product!: AdminProduct;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  listImgs: NzUploadFile[] = [];

  productFG: UntypedFormGroup = this._fb.group({
    'name': ['', [Validators.required]],
    'caName': ['', [Validators.required]],
    'esName': ['', [Validators.required]],
    'description': ['', [Validators.required]],
    'productTypeId': ['', [Validators.required]],
    'servings': this._fb.array([]),
  });

  beforeUpload = (file: NzUploadFile): boolean => {
    this.listImgs = this.listImgs.concat(file);
    return false;
  };

  constructor(private route: ActivatedRoute, private store: Store,
    private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.allProductTypesObs.subscribe((result) => {
      this.allProductTypes = result;
    });

    this.productObs.subscribe((result) => {
      this.product = result;
      if (this.product != null) {
        this.productFG.reset();
        this.productFG.controls['name'].setValue(this.product.name);
        this.productFG.controls['caName'].setValue(this.product.caName);
        this.productFG.controls['esName'].setValue(this.product.esName);
        this.productFG.controls['description'].setValue(this.product.description);
        this.productFG.controls['productTypeId'].setValue(this.product.productType.id);

        if (this.product.servings && this.product.servings.length >= 0) {
          this.servings.clear();
          this.product.servings.forEach((v, i) => {
            const control = this._fb.group({
              'name': [{value: v.name, disabled: true}, Validators.required],
              'numberOfPeople': [{value: v.numberOfPeople, disabled: true}, Validators.required],
              'price': [{value: v.price, disabled: true}, Validators.required],
              'id': [v.id],
            });
            this.servings.push(control);
          })
        }

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
        preview: true
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
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      });
    }
    return imageUrls;
  }

  submitForm(): void {
    let updateRequest = new AdminUpdateProductRequest(this.product);
    updateRequest.name = this.productFG.controls['name'].value;
    updateRequest.caName = this.productFG.controls['caName'].value;
    updateRequest.esName = this.productFG.controls['esName'].value;
    updateRequest.description = this.productFG.controls['description'].value;
    updateRequest.productTypeId = this.productFG.controls['productTypeId'].value;
    this.store.dispatch(new AdminUpdateProduct(updateRequest));
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    
    if (this.product != null) {
      this.productFG.controls['name'].setValue(this.product.name);
      this.productFG.controls['caName'].setValue(this.product.caName);
      this.productFG.controls['esName'].setValue(this.product.esName);
      this.productFG.controls['description'].setValue(this.product.description);
    }

    for (const key in this.productFG.controls) {
      if (this.productFG.controls.hasOwnProperty(key)) {
        this.productFG.controls[key].markAsPristine();
        this.productFG.controls[key].updateValueAndValidity();
      }
    }
  }

  onUpdateStatus(status: string) {
    let updateRequest = new AdminUpdateProductRequest(this.product);
    updateRequest.status = status;
    this.store.dispatch(new AdminUpdateProduct(updateRequest));
  }

  setMainImage(imageId: string) {
    this.store.dispatch(new AdminUpdateMainProductImage(imageId));
  }

  deleteImage(imageId: string) {
    this.store.dispatch(new AdminDeleteProductImage(imageId));
  }

  uploadImage() {
    const formData = new FormData();
    this.listImgs.forEach((file: any) => {
      formData.append('productImages', file);
    });
    this.store.dispatch(new AdminUploadProductImage(formData));
    this.listImgs = [];
  }

  removeField(index: number): void {
    if (this.servings.length > 1) {
      this.servings.removeAt(index);
    }
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    const control = this._fb.group({
      'name': ['', Validators.required],
      'numberOfPeople': ['', Validators.required],
      'price': ['', Validators.required]
    });

    this.servings.push(control);;
  }

  enable(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    if (group.controls['id'] != null) {
      group.controls['name'].enable();
      group.controls['numberOfPeople'].enable();
      group.controls['price'].enable();
    }
  }

  resetAServing(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;

    this.product.servings.forEach((v, i) => {
      if (i == index) {
        group.controls['name'].setValue(v.name);
        group.controls['numberOfPeople'].setValue(v.numberOfPeople);
        group.controls['price'].setValue(v.price);
      }
    });

    if (group.controls['id'] != null) {
      group.controls['name'].disable();
      group.controls['numberOfPeople'].disable();
      group.controls['price'].disable();
    }
  }

  isEditMode(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    return group.controls['name'].enabled;
  }

  isNewServing(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    return group.value['id'] == null;
  }

  updateServing(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    this.store.dispatch(new AdminUpdateServing({
      id: group.value['id'],
      name: group.value['name'],
      numberOfPeople: group.value['numberOfPeople'],
      price: group.value['price'],
      description: group.value['name'],
      productId: this.product.id
    }));
  }

  deleteServing(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    this.store.dispatch(new AdminDeleteServing(group.value['id']));
  }

  addNewServing(index: number) {
    let group = this.servings.controls[index] as UntypedFormGroup;
    this.store.dispatch(new AdminAddServing({
      name: group.value['name'],
      numberOfPeople: group.value['numberOfPeople'],
      price: group.value['price'],
      description: group.value['name'],
      productId: this.product.id
    }));
  }

  get servings() {
    return this.productFG.controls["servings"] as UntypedFormArray;
  }

  ngOnDestroy() {
    this.store.dispatch(new AdminClearProduct());
  }
}
