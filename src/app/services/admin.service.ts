import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginationResponse } from 'src/dtos/pagination-response';
import { AdminReservation } from 'src/dtos/reservation/admin-reservation';
import { AdminReservationQueryRequest } from 'src/dtos/reservation/admin-reservation-query-request';
import { BaseResponse } from 'src/dtos/base-response';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient) {
    }

    getReservations(query: AdminReservationQueryRequest) : Observable<PaginationResponse<AdminReservation[]>> {
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

    getReservationById(id: string) : Observable<BaseResponse<AdminReservation>> {
        return this.http.get<BaseResponse<AdminReservation>>(environment.apiUrl + 'reservation/' + id + '/details');
    }
}