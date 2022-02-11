import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminClearProduct, AdminGetProductById, AdminUpdateProduct } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ProductStatus } from 'src/commons/enums/app-enum';
import { AdminProduct } from 'src/dtos/product/admin-product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProduct) productObs!: Observable<AdminProduct>;
  product!: AdminProduct;
  nameFC = new FormControl("", [Validators.required]);
  esNameFC = new FormControl("", [Validators.required]);
  caNameFC = new FormControl("", [Validators.required]);
  descriptionFC = new FormControl("", [Validators.required]);
  statusFC = new FormControl("", [Validators.required]);


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
      }
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.store.dispatch(new AdminGetProductById(id));
    }
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
