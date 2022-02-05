import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Observable, tap } from "rxjs";
import { PaginationResponse } from "src/dtos/pagination-response";
import { AdminReservation } from "src/dtos/reservation/admin-reservation";
import { AdminReservationQueryRequest } from "src/dtos/reservation/admin-reservation-query-request";
import { AdminGetReservations } from "../actions/admin.action";
import { AdminService } from "../services/admin.service";

export class AdminStateModel {
    reservations!: PaginationResponse<AdminReservation[]> | null;
    reservationQuery!: AdminReservationQueryRequest;
    actions!: string[];
}

@State<AdminStateModel>({
    name: 'admin',
    defaults: {
        reservations: null,
        reservationQuery: new AdminReservationQueryRequest(),
        actions: []
    }
})

@Injectable()
export class AdminState {

    constructor(private store: Store, private adminService: AdminService) {
    }

    @Selector()
    static getReservations(state: AdminStateModel) {
        return state.reservations;
    }

    @Selector()
    static getActions(state: AdminStateModel) {
        return state.actions;
    }

    @Selector()
    static getReservationQuery(state: AdminStateModel) {
        return state.reservationQuery;
    }

    @Action(AdminGetReservations)
    getReservations({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminReservation[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetReservations.name],
            reservationQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetReservations.name), 1);
        state = getState();

        return this.adminService.getReservations(state.reservationQuery).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    reservations: result,
                    actions: tempActions
                });
            } else {
                setState({
                    ...state,
                    actions: tempActions
                });
            }
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
    }
}