import { AfterContentChecked, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription, tap } from 'rxjs';
import { AdminGetProducts } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ColumnItem } from 'src/dtos/column-item';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminProduct } from 'src/dtos/product/admin-product';
import { AdminProductQueryRequest } from 'src/dtos/product/admin-product-query-request';


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, AfterContentChecked {
  private routeSub!: Subscription;
  setOfCheckedId = new Set<string>();
  checked = false;
  indeterminate = false;
  nameSearchValue = '';
  esNameSearchValue = '';
  caNameSearchValue = '';
  descriptionSearchValue = '';
  nameVisible = false;
  esNameVisible = false;
  caNameVisible = false;
  descriptionVisible = false;

  @Select(AdminState.getProducts) productsObs!: Observable<PaginationResponse<AdminProduct[]>>;
  @Select(AdminState.getProductQuery) productsQueryObs!: Observable<AdminProductQueryRequest>;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProduct) productObs!: Observable<AdminProduct>;

  nameColumn: ColumnItem<AdminProduct> = {
    name: 'Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  esNameColumn: ColumnItem<AdminProduct> = {
    name: 'Es Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  caNameColumn: ColumnItem<AdminProduct> = {
    name: 'Ca Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  descriptionColumn: ColumnItem<AdminProduct> = {
    name: 'Description',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  productTypeColumn: ColumnItem<AdminProduct> = {
    name: 'Product type',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  statusColumn: ColumnItem<AdminProduct> = {
    name: 'Status',
    filterMultiple: false,
    listOfFilter: [
      { text: 'In stock', value: 'InStock' },
      { text: 'Out Of Stock', value: 'OutOfStock' }
    ],
    filterFn: () => {
      return true
    },
  }

  products!: PaginationResponse<AdminProduct[]>;
  product!: AdminProduct;
  productQuery!: AdminProductQueryRequest;

  constructor(private store: Store, public route: ActivatedRoute, private router: Router,
    private cdRef : ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.split('/').length < 4 && this.route.parent?.snapshot.url[2]?.path == 'products') {
          let query = _.clone(this.productQuery);
          this.router.navigate(['/admin/products'], { queryParams: query });
        }
      }
    });
    this.productsObs.subscribe((result) => {
      this.products = result;
    });

    this.productObs.subscribe((result) => {
      this.product = result;
    });

    this.productsQueryObs.subscribe((result) => {
      this.productQuery = result;
      this.nameSearchValue = this.productQuery.name || '';
      this.esNameSearchValue = this.productQuery.esName || '';
      this.caNameSearchValue = this.productQuery.caName || '';
      this.descriptionSearchValue = this.productQuery.description || '';
      if (this.statusColumn.listOfFilter != null && this.statusColumn.listOfFilter.length > 0) {
        this.statusColumn.listOfFilter.forEach((v) => {
          this.productQuery.statuses?.forEach((status) => {
            if (status == v.value) {
              v.byDefault = true;
            }
          });
        });
      }
    });

    this.routeSub = this.route.queryParams
      .subscribe(params => {
        if ( this.router.url.split('/').length >= 4) {
          return;
        }
        let query: AdminProductQueryRequest = JSON.parse(JSON.stringify(params));
        if (query.pageNumber == null || query.pageNumber == undefined) {
          query.pageNumber = 1;
        }
        this.store.dispatch(new AdminGetProducts(query));
        this.setOfCheckedId.clear();
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let query = _.clone(this.productQuery);
    if (query.pageNumber != pageIndex) {
      query.pageNumber = pageIndex;
    } else {
      query.pageNumber = 1;
    }

    if (sortField != null && sortOrder != null) {
      query.orderBy = sortField.toString() + " " + (sortOrder.toString() == 'descend' ? 'desc' : 'asc');
    } else {
      query.orderBy = null;
    }

    query.pageSize = pageSize;

    if (filter != null && filter.length > 0 && filter[0].value.length > 0) {
      query.statuses = filter[0].value;
    } else {
      query.statuses = null;
    }

    this.router.navigate(['/admin/products'], { queryParams: query });
  }

  resetSearchName(): void {
    this.nameSearchValue = '';
    this.searchName();
  }

  searchName(): void {
    this.nameVisible = false;
    let query = _.clone(this.productQuery);
    query.name = this.nameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/products'], { queryParams: query });
  }

  resetSearchEsName(): void {
    this.esNameSearchValue = '';
    this.searchName();
  }

  searchEsName(): void {
    this.esNameVisible = false;
    let query = _.clone(this.productQuery);
    query.esName = this.esNameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/products'], { queryParams: query });
  }

  resetSearchCaName(): void {
    this.caNameSearchValue = '';
    this.searchName();
  }

  searchCaName(): void {
    this.caNameVisible = false;
    let query = _.clone(this.productQuery);
    query.caName = this.caNameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/products'], { queryParams: query });
  }

  resetSearchDescription(): void {
    this.descriptionSearchValue = '';
    this.searchName();
  }

  searchDescription(): void {
    this.descriptionVisible = false;
    let query = _.clone(this.productQuery);
    query.description = this.descriptionSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/products'], { queryParams: query });
  }

  onAllChecked(value: boolean): void {
    this.products.payload.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  getCheckedItem() : AdminProduct | null | undefined {
    if (this.setOfCheckedId == null || this.setOfCheckedId.size != 1
        || this.products == null || this.products.payload == null ||  this.products.payload.length == 0) {
      return null;
    }
    return this.products.payload.find(res => this.setOfCheckedId.has(res.id));
  }

  refreshCheckedStatus(): void {
    this.checked = this.products.payload.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.products.payload.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

   viewDetail() {
    let id = this.getCheckedItem()?.id;
    this.ngZone.run(() => {
      this.router.navigate(['/admin/products/' + id]);
    });
   }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngAfterContentChecked() : void {
    this.cdRef.detectChanges();
  }
}

