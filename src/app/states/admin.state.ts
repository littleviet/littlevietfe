import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Observable, tap } from "rxjs";
import { BaseResponse } from "src/dtos/base-response";
import { AdminOrder } from "src/dtos/order/admin-order";
import { AdminOrderQueryRequest } from "src/dtos/order/admin-order-query-request";
import { AdminOrderInfo } from "src/dtos/order/admin-order.info";
import { PaginationResponse } from "src/dtos/pagination-response";
import { AdminProductType } from "src/dtos/product-type/admin-product-type";
import { AdminProductTypeQueryRequest } from "src/dtos/product-type/admin-product-type-query-request";
import { AdminProduct } from "src/dtos/product/admin-product";
import { AdminProductQueryRequest } from "src/dtos/product/admin-product-query-request";
import { AdminReservation } from "src/dtos/reservation/admin-reservation";
import { AdminReservationQueryRequest } from "src/dtos/reservation/admin-reservation-query-request";
import { AdminClearProduct, AdminClearProductType, AdminClearReservation, AdminCreateProductType, AdminGetOrders, AdminGetProductById, AdminGetProducts, AdminGetProductTypeById, AdminGetProductTypes, AdminGetReservationById, AdminGetReservations, AdminUpdateProduct, AdminUpdateProductType, AdminUpdateReservation, SearchPickUpOrderById, SearchPickUpOrders } from "../actions/admin.action";
import { AdminService } from "../services/admin.service";

export class AdminStateModel {
    reservations!: PaginationResponse<AdminReservation[]> | null;
    reservation!: AdminReservation | null;
    reservationQuery!: AdminReservationQueryRequest;
    orders!: PaginationResponse<AdminOrder[]> | null;
    orderQuery!: AdminOrderQueryRequest;
    products!: PaginationResponse<AdminProduct[]> | null;
    product!: AdminProduct | null;
    productQuery!: AdminProductQueryRequest;
    productTypes!: PaginationResponse<AdminProductType[]> | null;
    productType!: AdminProductType | null;
    productTypeQuery!: AdminProductTypeQueryRequest;
    pickUpOrders!: PaginationResponse<AdminOrder[]> | null;
    pickUpOrder!: AdminOrderInfo | null;
    pickUpOderQuery!: AdminOrderQueryRequest;
    actions!: string[];
}

@State<AdminStateModel>({
    name: 'admin',
    defaults: {
        reservations: null,
        reservationQuery: new AdminReservationQueryRequest(),
        reservation: null,
        orders: null,
        orderQuery: new AdminOrderQueryRequest(),
        products: null,
        productQuery: new AdminProductQueryRequest(),
        product: null,
        productTypes: null,
        productTypeQuery: new AdminProductTypeQueryRequest(),
        productType: null,
        pickUpOrders: null,
        pickUpOderQuery: new AdminOrderQueryRequest(),
        pickUpOrder: null,
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
    static getReservation(state: AdminStateModel) {
        return state.reservation;
    }

    @Selector()
    static getActions(state: AdminStateModel) {
        return state.actions;
    }

    @Selector()
    static getReservationQuery(state: AdminStateModel) {
        return state.reservationQuery;
    }

    @Selector()
    static getOrders(state: AdminStateModel) {
        return state.orders;
    }

    @Selector()
    static getOrderQuery(state: AdminStateModel) {
        return state.orderQuery;
    }

    @Selector()
    static getProducts(state: AdminStateModel) {
        return state.products;
    }

    @Selector()
    static getProduct(state: AdminStateModel) {
        return state.product;
    }

    @Selector()
    static getProductQuery(state: AdminStateModel) {
        return state.productQuery;
    }

    @Selector()
    static getProductTypes(state: AdminStateModel) {
        return state.productTypes;
    }

    @Selector()
    static getProductType(state: AdminStateModel) {
        return state.productType;
    }

    @Selector()
    static getProductTypeQuery(state: AdminStateModel) {
        return state.productTypeQuery;
    }

    @Selector()
    static getPickUpOders(state: AdminStateModel) {
        return state.pickUpOrders;
    }

    @Selector()
    static getPickUpOderQuery(state: AdminStateModel) {
        return state.pickUpOderQuery;
    }

    @Selector()
    static getPickUpOrder(state: AdminStateModel) {
        return state.pickUpOrder;
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

    @Action(AdminGetReservationById)
    getReservationById({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminReservation>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetReservationById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetReservationById.name), 1);
        state = getState();

        return this.adminService.getReservationById(payload.id).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    reservation: result.payload,
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

    @Action(AdminUpdateReservation)
    updateReservation({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetReservationById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetReservationById.name), 1);
        return this.adminService.updateReservation(payload.reservation).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new AdminGetReservationById(state.reservation?.id || ''));
                // this.message.create('success', 'Update successful!');
                setState({
                    ...state,
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


    @Action(AdminClearReservation)
    clearCart({getState, setState}: StateContext<AdminStateModel>) {
        const state = getState();
        setState({
            ...state,
           reservation: null
        });
    }

    @Action(AdminGetOrders)
    getOrders({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminOrder[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetOrders.name],
            orderQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetOrders.name), 1);
        state = getState();

        return this.adminService.getTakeAwayOrders(state.orderQuery).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    orders: result,
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

    @Action(AdminGetProducts)
    getProducts({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminProduct[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProducts.name],
            productQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProducts.name), 1);
        state = getState();

        return this.adminService.getProducts(state.productQuery).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    products: result,
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

    @Action(AdminGetProductById)
    getProductById({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminProduct>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProductById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProductById.name), 1);
        state = getState();

        return this.adminService.getProductById(payload.id).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    product: result.payload,
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

    @Action(AdminUpdateProduct)
    updateProduct({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUpdateProduct.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminUpdateProduct.name), 1);
        return this.adminService.updateProduct(payload.product).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new AdminGetProductById(state.product?.id || ''));
                // this.message.create('success', 'Update successful!');
                setState({
                    ...state,
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

    @Action(AdminClearProduct)
    clearProduct({getState, setState}: StateContext<AdminStateModel>) {
        const state = getState();
        setState({
            ...state,
           product: null
        });
    }

    @Action(AdminGetProductTypes)
    getProductTypes({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminProductType[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProductTypes.name],
            productTypeQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProductTypes.name), 1);
        state = getState();

        return this.adminService.getProductTypes(state.productQuery).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    productTypes: result,
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

    @Action(AdminGetProductTypeById)
    getProductTypeById({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminProductType>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProductTypeById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProductTypeById.name), 1);
        state = getState();

        return this.adminService.getProductTypeById(payload.id).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    productType: result.payload,
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

    @Action(AdminUpdateProductType)
    updateProductType({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUpdateProductType.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminUpdateProductType.name), 1);
        return this.adminService.updateProductType(payload.productType).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new AdminGetProductTypeById(state.productType?.id || ''));
                // this.message.create('success', 'Update successful!');
                setState({
                    ...state,
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

    @Action(AdminClearProductType)
    clearProductType({getState, setState}: StateContext<AdminStateModel>) {
        const state = getState();
        setState({
            ...state,
           productType: null
        });
    }

    @Action(SearchPickUpOrders)
    searchPickUpOrders({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminOrder[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchPickUpOrders.name],
            pickUpOderQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchPickUpOrders.name), 1);
        state = getState();

        return this.adminService.getTakeAwayOrders(state.pickUpOderQuery).pipe(tap((result) => {
            if (result.success) {
                if (state.pickUpOrders != null && state.pickUpOderQuery.pageNumber != 1) {
                    result.payload = [...state.pickUpOrders.payload, ...result.payload]
                }

                setState({
                    ...state,
                    pickUpOrders: result,
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

    @Action(SearchPickUpOrderById)
    searchPickUpOrderById({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminOrderInfo>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchPickUpOrderById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchPickUpOrderById.name), 1);

        return this.adminService.getTakeAwayOrderById(payload.id).pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    pickUpOrder: result.payload,
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
            
    @Action(AdminCreateProductType)
    createProductType({getState, setState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminCreateProductType.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminCreateProductType.name), 1);
        return this.adminService.createProductType(payload.productType).pipe(tap((result) => {
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
    }
}
