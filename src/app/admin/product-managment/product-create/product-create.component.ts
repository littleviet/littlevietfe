import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { AdminGetAllProductTypes } from 'src/app/actions/admin.action';
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
    'productTypeId': ['', [Validators.required]],
    'servings': this._fb.array([])
  });

  beforeUpload = (file: NzUploadFile): boolean => {
    this.listImgs = this.listImgs.concat(file);
    console.log("Imgs:", this.listImgs);
    return false;
  };

  ngOnInit() {
    this.store.dispatch(new AdminGetAllProductTypes());

    this.allProductTypesObs.subscribe((result) => {
      this.allProductTypes = result;
    });

    this.addField();
  }

  submitForm() {
    console.log(this.productFG.value);
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
      'numberOfPeople': [1, Validators.required],
      'price': [0, Validators.required]
    });

    this.servings.push(control);;
  }

  get servings() {
    return this.productFG.controls["servings"] as FormArray;
  }
}
