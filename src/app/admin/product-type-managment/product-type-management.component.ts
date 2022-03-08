import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subscription, tap } from 'rxjs';
import { AdminGetProductTypes } from 'src/app/actions/admin.action';
import { AdminState } from 'src/app/states/admin.state';
import { ColumnItem } from 'src/dtos/column-item';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminProductType } from 'src/dtos/product-type/admin-product-type';
import { AdminProductTypeQueryRequest } from 'src/dtos/product-type/admin-product-type-query-request';


@Component({
  selector: 'app-product-type-management',
  templateUrl: './product-type-management.component.html',
  styleUrls: ['./product-type-management.component.scss']
})
export class ProductTypeManagementComponent implements OnInit, AfterContentChecked {
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

  @Select(AdminState.getProductTypes) productTypesObs!: Observable<PaginationResponse<AdminProductType[]>>;
  @Select(AdminState.getProductTypeQuery) productTypesQueryObs!: Observable<AdminProductTypeQueryRequest>;
  @Select(AdminState.getActions) adminActionsObs!: Observable<string[]>;
  @Select(AdminState.getProductType) productTypeObs!: Observable<AdminProductType>;

  nameColumn: ColumnItem<AdminProductType> = {
    name: 'Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  esNameColumn: ColumnItem<AdminProductType> = {
    name: 'Es Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  caNameColumn: ColumnItem<AdminProductType> = {
    name: 'Ca Name',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  };

  descriptionColumn: ColumnItem<AdminProductType> = {
    name: 'Description',
    sortOrder: null,
    sortDirections: ['ascend', 'descend', null],
  }

  productTypes!: PaginationResponse<AdminProductType[]>;
  productType!: AdminProductType;
  productTypeQuery!: AdminProductTypeQueryRequest;

  constructor(private store: Store, public route: ActivatedRoute, private router: Router,
    private cdRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.split('/').length < 4 && this.route.parent?.snapshot.url[2]?.path == 'product-types') {
          let query = _.clone(this.productTypeQuery);
          this.router.navigate(['/admin/product-types'], { queryParams: query });
        }
      }
    });
    this.productTypesObs.subscribe((result) => {
      this.productTypes = result;
    });

    this.productTypeObs.subscribe((result) => {
      this.productType = result;
    });

    this.productTypesQueryObs.subscribe((result) => {
      this.productTypeQuery = result;
      this.nameSearchValue = this.productTypeQuery.name || '';
      this.esNameSearchValue = this.productTypeQuery.esName || '';
      this.caNameSearchValue = this.productTypeQuery.caName || '';
      this.descriptionSearchValue = this.productTypeQuery.description || '';
    });

    this.routeSub = this.route.queryParams
      .subscribe(params => {
        if ( this.router.url.split('/').length >= 4) {
          return;
        }
        let query: AdminProductTypeQueryRequest = JSON.parse(JSON.stringify(params));
        if (query.pageNumber == null || query.pageNumber == undefined) {
          query.pageNumber = 1;
        }
        this.store.dispatch(new AdminGetProductTypes(query));
        this.setOfCheckedId.clear();
      }
    );
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    let query = _.clone(this.productTypeQuery);
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

    this.router.navigate(['/admin/product-types'], { queryParams: query });
  }

  resetSearchName(): void {
    this.nameSearchValue = '';
    this.searchName();
  }

  searchName(): void {
    this.nameVisible = false;
    let query = _.clone(this.productTypeQuery);
    query.name = this.nameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/product-types'], { queryParams: query });
  }

  resetSearchEsName(): void {
    this.esNameSearchValue = '';
    this.searchName();
  }

  searchEsName(): void {
    this.esNameVisible = false;
    let query = _.clone(this.productTypeQuery);
    query.esName = this.esNameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/product-types'], { queryParams: query });
  }

  resetSearchCaName(): void {
    this.caNameSearchValue = '';
    this.searchName();
  }

  searchCaName(): void {
    this.caNameVisible = false;
    let query = _.clone(this.productTypeQuery);
    query.caName = this.caNameSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/product-types'], { queryParams: query });
  }

  resetSearchDescription(): void {
    this.descriptionSearchValue = '';
    this.searchName();
  }

  searchDescription(): void {
    this.descriptionVisible = false;
    let query = _.clone(this.productTypeQuery);
    query.description = this.descriptionSearchValue;
    query.pageNumber = 1;
    this.router.navigate(['/admin/product-types'], { queryParams: query });
  }

  onAllChecked(value: boolean): void {
    this.productTypes.payload.forEach(item => this.updateCheckedSet(item.id, value));
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

  getCheckedItem() : AdminProductType | null | undefined {
    if (this.setOfCheckedId == null || this.setOfCheckedId.size != 1
        || this.productTypes == null || this.productTypes.payload == null ||  this.productTypes.payload.length == 0) {
      return null;
    }
    return this.productTypes.payload.find(res => this.setOfCheckedId.has(res.id));
  }

  refreshCheckedStatus(): void {
    this.checked = this.productTypes.payload.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.productTypes.payload.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  viewClick(id: string) {
    if (id == '') return;
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
