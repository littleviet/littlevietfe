import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminClearProductType, AdminCreateProductType} from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { AdminProductType } from 'src/dtos/product-type/admin-product-type';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-type-create.component.html',
  styleUrls: ['./product-type-create.component.scss']
})
export class ProductTypeCreateComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProductType) productTypeObs!: Observable<AdminProductType>;
  productType: AdminProductType | null = null;
  nameFC = new FormControl("", [Validators.required]);
  esNameFC = new FormControl("", [Validators.required]);
  caNameFC = new FormControl("", [Validators.required]);
  descriptionFC = new FormControl("", [Validators.required]);


  validateForm: FormGroup = new FormGroup({
    name: this.nameFC,
    caName: this.caNameFC,
    esName: this.esNameFC,
    description: this.descriptionFC,
  });

  constructor(private store: Store) { }

  ngOnInit() {
    this.productTypeObs.subscribe((result) => {
      this.productType = result;
    });
  }

  submitForm(): void {
    this.store.dispatch(new AdminCreateProductType(this.validateForm.value));
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    if (this.productType != null) {
      this.nameFC.setValue(this.productType.name);
      this.caNameFC.setValue(this.productType.caName);
      this.esNameFC.setValue(this.productType.esName);
      this.descriptionFC.setValue(this.productType.description);
    }
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new AdminClearProductType());
  }

}
