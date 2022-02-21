import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';
import { AdminReservationQueryRequest } from 'src/dtos/reservation/admin-reservation-query-request';
import { BaseResponse } from 'src/dtos/base-response';
import { AdminOrderQueryRequest } from 'src/dtos/order/admin-order-query-request';
import { AdminOrder } from 'src/dtos/order/admin-order';
import { AdminProduct } from 'src/dtos/product/admin-product';
import { AdminProductQueryRequest } from 'src/dtos/product/admin-product-query-request';
import { AdminProductTypeQueryRequest } from 'src/dtos/product-type/admin-product-type-query-request';
import { AdminProductType } from 'src/dtos/product-type/admin-product-type';
import { AdminOrderInfo } from 'src/dtos/order/admin-order.info';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getReservations(query: AdminReservationQueryRequest): Observable<PaginationResponse<AdminReservation[]>> {
    let queryString = "";
    let first = true;
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (key == 'statuses' && Array.isArray(value)) {
        value.forEach((e: any) => {
          queryString += ('&' + key + '=' + e.toString());
        });
        return;
      }

      if (first) {
        queryString += (key + '=' + value)
        first = false;
      } else {
        queryString += ('&' + key + '=' + value)
      }
    })
    return this.http.get<PaginationResponse<AdminReservation[]>>(environment.apiUrl + 'reservation?' + queryString);
  }

  getReservationById(id: string): Observable<BaseResponse<AdminReservation>> {
    return this.http.get<BaseResponse<AdminReservation>>(environment.apiUrl + 'reservation/' + id);
  }

  updateReservation(reservation: AdminReservation): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(environment.apiUrl + 'reservation/' + reservation.id, reservation);
  }

  getTakeAwayOrders(query: AdminOrderQueryRequest): Observable<PaginationResponse<AdminOrder[]>> {
    let queryString = "";
    let first = true;
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (key == 'orderTypes' && Array.isArray(value)) {
        value.forEach((e: any) => {
          queryString += ('&' + key + '=' + e.toString());
        });
        return;
      }

      if (first) {
        queryString += (key + '=' + value)
        first = false;
      } else {
        queryString += ('&' + key + '=' + value)
      }
    })
    return this.http.get<PaginationResponse<AdminOrder[]>>(environment.apiUrl + 'order?' + queryString);
  }
  
  getTakeAwayOrderById(id: string): Observable<BaseResponse<AdminOrderInfo>> {
    return this.http.get<BaseResponse<AdminOrderInfo>>(environment.apiUrl + 'order/' + id);
  }

  getProducts(query: AdminProductQueryRequest): Observable<PaginationResponse<AdminProduct[]>> {
    let queryString = "";
    let first = true;
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (key == 'statuses' && Array.isArray(value)) {
        value.forEach((e: any) => {
          queryString += ('&' + key + '=' + e.toString());
        });
        return;
      }

      if (first) {
        queryString += (key + '=' + value)
        first = false;
      } else {
        queryString += ('&' + key + '=' + value)
      }
    })
    return this.http.get<PaginationResponse<AdminProduct[]>>(environment.apiUrl + 'product?' + queryString);
  }

  getProductById(id: string): Observable<BaseResponse<AdminProduct>> {
    return this.http.get<BaseResponse<AdminProduct>>(environment.apiUrl + 'product/' + id);
  }

  updateProduct(product: AdminProduct): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(environment.apiUrl + 'product/' + product.id, product);
  }

  getProductTypes(query: AdminProductTypeQueryRequest): Observable<PaginationResponse<AdminProductType[]>> {
    let queryString = "";
    let first = true;
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (key == 'statuses' && Array.isArray(value)) {
        value.forEach((e: any) => {
          queryString += ('&' + key + '=' + e.toString());
        });
        return;
      }

      if (first) {
        queryString += (key + '=' + value)
        first = false;
      } else {
        queryString += ('&' + key + '=' + value)
      }
    })
    return this.http.get<PaginationResponse<AdminProductType[]>>(environment.apiUrl + 'product-type?' + queryString);
  }

  getProductTypeById(id: string): Observable<BaseResponse<AdminProductType>> {
    return this.http.get<BaseResponse<AdminProductType>>(environment.apiUrl + 'product-type/' + id);
  }

  updateProductType(productType: AdminProductType): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(environment.apiUrl + 'product-type/' + productType.id, productType);
  }
}
