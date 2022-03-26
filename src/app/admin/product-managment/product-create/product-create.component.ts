import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { AdminCreateProduct, AdminGetAllProductTypes } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminProductType } from 'src/dtos/product-type/admin-product-type';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getAllProductTypes) allProductTypesObs!: Observable<AdminProductType[]>;
  allProductTypes: AdminProductType[] = [];
  listImgs: NzUploadFile[] = [];

  constructor(private store: Store, private _fb: FormBuilder) { }

  productFG: FormGroup = this._fb.group({
    'name': ['', [Validators.required]],
    'caName': ['', [Validators.required]],
    'esName': ['', [Validators.required]],
    'description': ['', [Validators.required]],
    'status': ['InStock', [Validators.required]],
    'productTypeId': ['', [Validators.required]]
  });

  beforeUpload = (file: NzUploadFile): boolean => {
    this.listImgs = this.listImgs.concat(file);
    return false;
  };

  ngOnInit() {
    this.store.dispatch(new AdminGetAllProductTypes());

    this.allProductTypesObs.subscribe((result) => {
      this.allProductTypes = result;
    });
  }

  submitForm() {
    const formData = new FormData();
    if (this.listImgs != null && this.listImgs.length > 0) {
      this.listImgs.forEach((file: any) => {
        formData.append('productImages', file);
      });
      formData.append('mainImage', '0');
    }
    formData.append('name', this.productFG.value['name']);
    formData.append('caName', this.productFG.value['caName']);
    formData.append('esName', this.productFG.value['esName']);
    formData.append('status', this.productFG.value['status']);
    formData.append('productTypeId', this.productFG.value['productTypeId']);
    formData.append('description', this.productFG.value['description']);
    
    this.listImgs = [];
    this.store.dispatch(new AdminCreateProduct(formData));
  }

  resetForm(e: MouseEvent) {
    e.preventDefault();
    this.productFG.reset();

    for (const key in this.productFG.controls) {
      if (this.productFG.controls.hasOwnProperty(key)) {
        this.productFG.controls[key].markAsPristine();
        this.productFG.controls[key].updateValueAndValidity();
      }
    }
    this.productFG.controls['status'].setValue("InStock");
    this.listImgs = [];
  }
}
