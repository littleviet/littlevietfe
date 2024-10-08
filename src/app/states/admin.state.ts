import { Injectable, NgZone } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import * as _ from "lodash";
import { combineLatest, Observable, tap } from "rxjs";
import { BaseResponse } from "src/dtos/base-response";
import { AdminUseCouponInfo } from "src/dtos/coupon/admin-use-coupon-info";
import { CouponQueryRequest } from "src/dtos/coupon/coupon-query-request";
import { AdminOrder } from "src/dtos/order/admin-order";
import { AdminOrderQueryRequest } from "src/dtos/order/admin-order-query-request";
import { AdminOrderInfo } from "src/dtos/order/admin-order-info";
import { PaginationResponse } from "src/dtos/pagination-response";
import { AdminProductType } from "src/dtos/product-type/admin-product-type";
import { AdminProductTypeQueryRequest } from "src/dtos/product-type/admin-product-type-query-request";
import { AdminProduct } from "src/dtos/product/admin-product";
import { AdminProductQueryRequest } from "src/dtos/product/admin-product-query-request";
import { AdminReservation } from "src/dtos/reservation/admin-reservation";
import { AdminReservationQueryRequest } from "src/dtos/reservation/admin-reservation-query-request";
import { AdminClearProduct, AdminClearProductType, AdminClearReservation, AdminCreateProductType,
    AdminGetOrders, AdminGetProductById, AdminGetProducts, AdminGetProductTypeById, AdminGetProductTypes,
    AdminGetReservationById, AdminGetReservations, AdminUpdateProduct, AdminUpdateProductType, AdminUpdateReservation,
    SearchPickUpOrderById, SearchPickUpOrders, AdminGetAllProductTypes, AdminUpdateMainProductImage, AdminUploadProductImage,
    AdminDeleteProductImage, SearchReservationOrders, SearchReservationOrderById, AdminCreateProduct, AdminUpdateServing,
    AdminDeleteServing, AdminAddServing, AdminCompletePickUpOrder, AdminCheckInReservation, SearchUseCoupons, AdminUseCoupon,
    AdminGetOrderById, AdminClearOrder, AdminGetUnhandledTask,
    AdminUploadMenu,
} from "../actions/admin.action";
import { AdminService } from "../services/admin.service";
import { Router } from "@angular/router";
import { UnhandledTask } from "src/dtos/tasks/unhandled-task";

export class AdminStateModel {
    reservations!: PaginationResponse<AdminReservation[]> | null;
    reservation!: AdminReservation | null;
    reservationQuery!: AdminReservationQueryRequest;
    orders!: PaginationResponse<AdminOrder[]> | null;
    order!: AdminOrderInfo | null;
    orderQuery!: AdminOrderQueryRequest;
    products!: PaginationResponse<AdminProduct[]> | null;
    product!: AdminProduct | null;
    productQuery!: AdminProductQueryRequest;
    allProductTypes!: AdminProductType[] | null;
    productTypes!: PaginationResponse<AdminProductType[]> | null;
    productType!: AdminProductType | null;
    productTypeQuery!: AdminProductTypeQueryRequest;
    pickUpOrders!: PaginationResponse<AdminOrder[]> | null;
    pickUpOrder!: AdminOrderInfo | null;
    pickUpOderQuery!: AdminOrderQueryRequest;
    reservationOrders!:  PaginationResponse<AdminReservation[]> | null;
    reservationOrder!: AdminReservation | null;
    reservationOderQuery!: AdminReservationQueryRequest;
    useCouponQuery!: CouponQueryRequest;
    useCoupons!: PaginationResponse<AdminUseCouponInfo[]> | null;
    unhandledTask!: UnhandledTask | null;
    actions!: string[];
}

@State<AdminStateModel>({
    name: 'admin',
    defaults: {
        reservations: null,
        reservationQuery: new AdminReservationQueryRequest(),
        reservation: null,
        orders: null,
        order: null,
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
        allProductTypes: null,
        reservationOrders: null,
        reservationOrder: null,
        reservationOderQuery: new AdminReservationQueryRequest(),
        useCouponQuery: new CouponQueryRequest(),
        useCoupons: null,
        unhandledTask: null,
        actions: []
    }
})

@Injectable()
export class AdminState {

    constructor(private store: Store, private adminService: AdminService, private router: Router,
        private ngZone: NgZone) { }

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
    static getOrder(state: AdminStateModel) {
        return state.order;
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
    static getAllProductTypes(state: AdminStateModel) {
        return state.allProductTypes;
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

    @Selector()
    static getReservationOders(state: AdminStateModel) {
        return state.reservationOrders;
    }

    @Selector()
    static getReservationOder(state: AdminStateModel) {
        return state.reservationOrder;
    }

    @Selector()
    static getReservationOderQuery(state: AdminStateModel) {
        return state.reservationOderQuery;
    }

    @Selector()
    static getCouponQuery(state: AdminStateModel) {
        return state.useCouponQuery;
    }

    @Selector()
    static getUseCoupons(state: AdminStateModel) {
        return state.useCoupons;
    }

    @Selector()
    static getUnhandledTask(state: AdminStateModel) {
        return state.unhandledTask;
    }

    @Action(AdminGetReservations)
    getReservations({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<PaginationResponse<AdminReservation[]>> {
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
                patchState({
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
    getReservationById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<BaseResponse<AdminReservation>> {
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
                patchState({
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
    updateReservation({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUpdateReservation.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminUpdateReservation.name), 1);
        return this.adminService.updateReservation(payload.reservation).pipe(tap((result) => {
            if (result.success) {
                this.store.dispatch(new AdminGetReservationById(state.reservation?.id || ''));
                patchState({
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
    clearReservation({getState, setState, patchState}: StateContext<AdminStateModel>) {
        patchState({
           reservation: null
        });
    }

    @Action(AdminGetOrders)
    getOrders({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminOrder[]>> {
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
                patchState({
                    orders: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminGetOrderById)
    getOrderById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminOrderInfo>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetOrderById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetOrderById.name), 1);
        state = getState();

        return this.adminService.getTakeAwayOrderById(payload.id).pipe(tap((result) => {
            if (result.success) {
                patchState({
                    order: result.payload,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminClearOrder)
    cleareOrder({getState, setState, patchState}: StateContext<AdminStateModel>) {
        patchState({
           order: null
        });
    }

    @Action(AdminGetProducts)
    getProducts({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<PaginationResponse<AdminProduct[]>> {
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
                patchState({
                    products: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminGetProductById)
    getProductById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<[BaseResponse<AdminProduct>, PaginationResponse<AdminProductType[]>]> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProductById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProductById.name), 1);
        state = getState();
        let productTypeQuery = new AdminProductTypeQueryRequest();
        productTypeQuery.pageSize = 1000;
        return combineLatest(this.adminService.getProductById(payload.id), this.adminService.getProductTypes(productTypeQuery))
            .pipe(tap((result) => {
                if (result[0].success && result[1].success) {
                    patchState({
                        product: result[0].payload,
                        allProductTypes: result[1].payload,
                        actions: tempActions
                    });
                } else {
                    patchState({
                        actions: tempActions
                    });
                }
            }, error => {
                patchState({
                    actions: tempActions,
            });
        }));
    }

    @Action(AdminUpdateProduct)
    updateProduct({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
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
                patchState({
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUpdateMainProductImage)
    updateMainProductImage({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUpdateMainProductImage.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminUpdateMainProductImage.name), 1);
        return this.adminService.updateMainImage(state.product?.id || '', payload.imageId).pipe(tap((result) => {
            if (result.success) {
                let product = _.cloneDeep(state.product);
                product?.productImages.forEach(img => {
                    if (img.id == payload.imageId) {
                        img.isMain = true;
                        return;
                    }
                    if (img.isMain == true) {
                        img.isMain = false;
                    }
                });
                patchState({
                    actions: tempActions,
                    product: product
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminDeleteProductImage)
    deleteProductImage({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminDeleteProductImage.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminDeleteProductImage.name), 1);
        return this.adminService.deleteProductImage(state.product?.id || '', payload.imageId).pipe(tap((result) => {
            if (result.success) {
                let product = _.cloneDeep(state.product);
                product?.productImages.splice(product?.productImages.findIndex(img => img.id == payload.imageId), 1);
                patchState({
                    actions: tempActions,
                    product: product
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUploadProductImage)
    uploadProductImage({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUploadProductImage.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminUploadProductImage.name), 1);
        return this.adminService.uploadProductImages(state.product?.id || '', payload.data).pipe(tap((result) => {

            if (result.success) {
                patchState({
                    actions: tempActions,
                });
                this.store.dispatch(new AdminGetProductById(state.product?.id || ''));
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminClearProduct)
    clearProduct({getState, setState, patchState}: StateContext<AdminStateModel>) {
        patchState({
           product: null
        });
    }

    @Action(AdminGetAllProductTypes)
    getAllProductTypes({getState, setState, patchState}: StateContext<AdminStateModel>) : Observable<PaginationResponse<AdminProductType[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetAllProductTypes.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetAllProductTypes.name), 1);
        state = getState();
        let productTypeQuery = new AdminProductTypeQueryRequest();
        productTypeQuery.pageSize = 1000;
        return this.adminService.getProductTypes(productTypeQuery).pipe(tap((result) => {
            if (result.success) {
                patchState({
                    allProductTypes: result.payload,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminGetProductTypes)
    getProductTypes({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<PaginationResponse<AdminProductType[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetProductTypes.name],
            productTypeQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetProductTypes.name), 1);
        state = getState();

        return this.adminService.getProductTypes(state.productTypeQuery).pipe(tap((result) => {
            if (result.success) {
                patchState({
                    productTypes: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminGetProductTypeById)
    getProductTypeById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<BaseResponse<AdminProductType>> {
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
                patchState({
                    productType: result.payload,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUpdateProductType)
    updateProductType({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<BaseResponse<string>> {
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
                patchState({
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminClearProductType)
    clearProductType({getState, setState, patchState}: StateContext<AdminStateModel>) {
        patchState({
           productType: null
        });
    }

    @Action(SearchPickUpOrders)
    searchPickUpOrders({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any)
        : Observable<PaginationResponse<AdminOrder[]>> {
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
                patchState({
                    pickUpOrders: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(SearchUseCoupons)
    searchUseCoupons({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminUseCouponInfo[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchUseCoupons.name],
            useCouponQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchUseCoupons.name), 1);
        state = getState();

        return this.adminService.getUseCoupons(state.useCouponQuery).pipe(tap((result) => {
            if (result.success) {
                if (state.useCoupons != null && state.pickUpOderQuery.pageNumber != 1) {
                    result.payload = [...state.useCoupons.payload, ...result.payload]
                }

                patchState({
                    useCoupons: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(SearchPickUpOrderById)
    searchPickUpOrderById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminOrderInfo>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchPickUpOrderById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchPickUpOrderById.name), 1);

        return this.adminService.getTakeAwayOrderById(payload.id).pipe(tap((result) => {
            if (result.success) {
                patchState({
                    pickUpOrder: result.payload,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(SearchReservationOrders)
    searchReservationOrders({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<PaginationResponse<AdminReservation[]>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchReservationOrders.name],
            reservationOderQuery: payload.query
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchReservationOrders.name), 1);
        state = getState();

        return this.adminService.getReservations(state.reservationOderQuery).pipe(tap((result) => {
            if (result.success) {
                if (state.reservationOrders != null && state.reservationOderQuery.pageNumber != 1) {
                    result.payload = [...state.reservationOrders.payload, ...result.payload]
                }
                patchState({
                    reservationOrders: result,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(SearchReservationOrderById)
    searchReservationOrderById({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<AdminReservation>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, SearchReservationOrderById.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == SearchReservationOrderById.name), 1);

        return this.adminService.getReservationById(payload.id).pipe(tap((result) => {
            if (result.success) {
                patchState({
                    reservationOrder: result.payload,
                    actions: tempActions
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }
            
    @Action(AdminCreateProductType)
    createProductType({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminCreateProductType.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminCreateProductType.name), 1);
        return this.adminService.createProductType(payload.productType).pipe(tap((result) => {
            if (result.success) {
                this.ngZone.run(() => {
                    this.router.navigate(['/admin/product-types']);
                });
            }
            patchState({
                actions: tempActions
            });
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminCreateProduct)
    createProduct({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminCreateProduct.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminCreateProduct.name), 1);
        return this.adminService.createProduct(payload.data).pipe(tap((result) => {
            if (result.success) {
                this.ngZone.run(() => {
                    this.router.navigate(['/admin/products/' + result.payload]);
                });
            }
            patchState({
                actions: tempActions
            });
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUpdateServing)
    updateServing({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUpdateServing.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminUpdateServing.name), 1);
        return this.adminService.updateServing(payload.data).pipe(tap((result) => {
            patchState({
                actions: tempActions
            });
            if (result.success) {
                this.store.dispatch(new AdminGetProductById(state.product?.id || ''));
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminDeleteServing)
    deleteServing({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminDeleteServing.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminDeleteServing.name), 1);
        return this.adminService.deleteServing(payload.servingId).pipe(tap((result) => {
            patchState({
                actions: tempActions
            });
            if (result.success) {
                this.store.dispatch(new AdminGetProductById(state.product?.id || ''));
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminAddServing)
    addServing({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminAddServing.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminAddServing.name), 1);
        return this.adminService.createServing(payload.data).pipe(tap((result) => {
            patchState({
                actions: tempActions
            });
            if (result.success) {
                let serving = {
                    id: result.payload,
                    description: payload.data.description,
                    name: payload.data.name,
                    numberOfPeople: payload.data.numberOfPeople,
                    price: payload.data.price
                };

                if (state.product != null) {
                    setState({
                        ...state,
                        product: {
                            ...state.product,
                            servings: [...state.product.servings, serving]
                        }
                    });
                }
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminCompletePickUpOrder)
    completePickUpOrder({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminCompletePickUpOrder.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminCompletePickUpOrder.name), 1);
        return this.adminService.completePickUpOrder(payload.orderId).pipe(tap((result) => {
            if (result.success) {
                let pickUpOrder = _.cloneDeep(state.pickUpOrder);
                if (pickUpOrder != null) {
                    pickUpOrder.orderStatus = "PickedUp";
                }
                patchState({
                    actions: tempActions,
                    pickUpOrder: pickUpOrder
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminCheckInReservation)
    adminCheckUpReservation({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminCheckInReservation.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminCheckInReservation.name), 1);
        return this.adminService.checkinReservation(payload.reservationId).pipe(tap((result) => {
            if (result.success) {
                let reservationOrder = _.cloneDeep(state.reservationOrder);
                if (reservationOrder != null) {
                    reservationOrder.status = "Completed";
                }
                patchState({
                    actions: tempActions,
                    reservationOrder: reservationOrder
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUseCoupon)
    adminUseCoupon({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUseCoupon.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminUseCoupon.name), 1);
        return this.adminService.useCoupon(payload.useCouponInfo).pipe(tap((result) => {
            if (result.success) {
                let useCoupons = _.cloneDeep(state.useCoupons);
                if (useCoupons != null) {
                    useCoupons.payload.forEach(cp => {
                        if (cp.couponCode == payload.useCouponInfo.couponCode) {
                            cp.currentQuantity = cp.currentQuantity - payload.useCouponInfo.usage;
                        }
                    })
                }
                patchState({
                    actions: tempActions,
                    useCoupons: useCoupons
                });
            } else {
                patchState({
                    actions: tempActions
                });
            }
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminGetUnhandledTask)
    getUnhandledTask({getState, setState, patchState}: StateContext<AdminStateModel>)
        : Observable<UnhandledTask> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminGetUnhandledTask.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == AdminGetUnhandledTask.name), 1);

        return this.adminService.getUnhandledThings().pipe(tap((result) => {
            patchState({
                unhandledTask: result,
                actions: tempActions
            });
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }

    @Action(AdminUploadMenu)
    adminUploadMenu({getState, setState, patchState}: StateContext<AdminStateModel>, payload: any) : Observable<BaseResponse<string>> {
        let state = getState();
        setState({
            ...state,
            actions: [...state.actions, AdminUploadMenu.name],
        });
        let tempActions = [...state.actions];
        tempActions.splice(tempActions.findIndex(a => a == AdminUploadMenu.name), 1);
        return this.adminService.uploadMenu(payload.menu).pipe(tap((result) => {
            patchState({
                actions: tempActions
            });
        }, error => {
            patchState({
                actions: tempActions,
            });
        }));
    }
}
