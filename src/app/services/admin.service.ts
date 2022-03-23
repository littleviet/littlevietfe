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
import { AdminUpdateProductRequest } from 'src/dtos/product/admin-update-product-request';
import { CouponQueryRequest } from 'src/dtos/coupon/coupon-query-request';
import { AdminUseCouponInfo } from 'src/dtos/coupon/admin-use-coupon-info';

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
          if (first) {
            first = false;
            queryString += (key + '=' + e.toString());
          } else {
            queryString += ('&' + key + '=' + e.toString());
          }
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
          if (first) {
            first = false;
            queryString += (key + '=' + e.toString());
          } else {
            queryString += ('&' + key + '=' + e.toString());
          }
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

  getUseCoupons(query: CouponQueryRequest): Observable<PaginationResponse<AdminUseCouponInfo[]>> {
    let queryString = "";
    let first = true;
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (first) {
        queryString += (key + '=' + value)
        first = false;
      } else {
        queryString += ('&' + key + '=' + value)
      }
    })
    return this.http.get<PaginationResponse<AdminUseCouponInfo[]>>(environment.apiUrl + 'coupon/search?' + queryString);
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

  updateProduct(product: AdminUpdateProductRequest): Observable<BaseResponse<string>> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('caName', product.caName);
    formData.append('esName', product.esName);
    formData.append('imageChange', "false");
    formData.append('status', product.status);
    formData.append('productTypeId', product.productTypeId);
    formData.append('description', product.description);
    return this.http.put<BaseResponse<string>>(environment.apiUrl + 'product/' + product.id, formData);
  }

  updateMainImage(productId: string, imageId: string): Observable<BaseResponse<string>> {
    return this.http.get<BaseResponse<string>>(environment.apiUrl + 'product/' + productId + '/image/' + imageId + '/make-main');
  }

  uploadProductImages(productId: string, formData: FormData): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'product/' + productId + '/image', formData);
  }

  deleteProductImage(productId: string, imageId: string): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(environment.apiUrl + 'product/' + productId + '/image/' + imageId );
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

  createProductType(productType: AdminProductType): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'product-type', productType);
  }

  createProduct(data: FormData): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'product', data);
  }

  updateServing(data: any): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(environment.apiUrl + 'serving/' + data.id, data);
  }

  createServing(data: any): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'serving', data);
  }

  deleteServing(id: string): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(environment.apiUrl + 'serving/' + id);
  }

  completePickUpOrder(id: string): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'task/pickup-takeaway?orderId=' + id, {});
  }

  checkinReservation(id: string): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(environment.apiUrl + 'task/check-in-reservation?reservationId=' + id, {});
  }
}
