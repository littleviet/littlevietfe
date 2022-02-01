import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';
import { CusReservation } from 'src/dtos/reservation/cus-reservation';
import { TakeAwayServing } from 'src/dtos/serving/take-away-serving';
import { CheckOutCart, ClearCart, ClearReservation, GetTakeAwayProducts, UpdateCart, UpdatePickUpTime, UpdateReservationBookerInfo, UpdateReservationInfo } from '../actions/take-away.action';
import { TakeAwayService } from '../services/take-away.service';

export class TakeAwayStateModel {
    products: TakeAwayProduct[] = [];
    cart!: CartDetail;
    timePickUp!: string | null;
    actions!: string[];
    reservationInfo!: CusReservation;
    reservationSuccess!: boolean | null;
}

@State<TakeAwayStateModel>({
    name: 'takeaway',
    defaults: {
        products: [],
        cart: {
            servings: [],
            subTotalPrice: 0,
            totalPrice: 0,
        },
        timePickUp: null,
        actions: [],
        reservationInfo: new CusReservation(),
        reservationSuccess: null
    }
})

@Injectable()
export class TakeAwayState {

    constructor(private takeAwayService: TakeAwayService) {
    }

    @Selector()
    static getTakeAwayProducts(state: TakeAwayStateModel) {
        return state.products;
    }

    @Selector()
    static getCartDetail(state: TakeAwayStateModel) {
        return state.cart;
    }

    @Selector()
    static getTimePickUp(state: TakeAwayStateModel) {
        return state.timePickUp;
    }

    @Selector()
    static getActions(state: TakeAwayStateModel) {
        return state.actions;
    }

    @Selector()
    static getReservationInfo(state: TakeAwayStateModel) {
        return state.reservationInfo;
    }

    @Selector()
    static isCartEmpty(state: TakeAwayStateModel) {
        let totalItem = 0;
        if (state.cart && state.cart.servings && state.cart.servings.length > 0) {
            state.cart.servings.forEach(pro => {
                totalItem += pro.quantity;
            })
          }
          return totalItem <= 0;
    }

    @Selector()
    static isReservationSuccess(state: TakeAwayStateModel) {
          return state.reservationSuccess;
    }

    @Action(GetTakeAwayProducts)
    getTakeAwayProducts({getState, setState}: StateContext<TakeAwayStateModel>) : Observable<BaseResponse<TakeAwayProduct[]>> {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, GetTakeAwayProducts.name]
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == GetTakeAwayProducts.name), 1);
        return this.takeAwayService.getTakeAwayProductMenu().pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    products: result.payload,
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

    @Action(UpdateCart)
    updateCart({getState, setState}: StateContext<TakeAwayStateModel>, payload: UpdateCart) {
        const state = getState();
        let servings: TakeAwayServing[] = [];
        state.products.forEach(element => {
            if (element.servings && element.servings.length > 0) {
                Array.prototype.push.apply(servings, element.servings);
            }
        });
        let product = state.products
            .filter(pro => pro.servings && pro.servings.length > 0
                         && pro.servings.findIndex(ser => ser.id == payload.servingId) >= 0)[0];
        const index = servings.findIndex(p => p.id == payload.servingId);
        let cloneServings = _.cloneDeep(state.cart.servings) || [];
        const existed = cloneServings.findIndex(serving => serving.id == payload.servingId);

        if (existed >= 0) {
            cloneServings[existed].price = servings[index].price;
            cloneServings[existed].quantity += payload.quantity;
            setState({
                ...state,
                cart: {
                    ...state.cart,
                    servings: cloneServings
                }
            });
        } else {
            cloneServings.push({
                caName: product.caName,
                esName: product.esName + " - " + servings[index].name,
                name: product.name,
                quantity: payload.quantity,
                price: servings[index].price,
                id: servings[index].id
            });
        }
        cloneServings =  cloneServings.filter( serving => { return serving.quantity != 0; }); 
        let price = 0;
        cloneServings.forEach(serving => {
            price += serving.price * serving.quantity;
        });
        setState({
            ...state,
            cart: {
                ...state.cart,
                servings: cloneServings,
                subTotalPrice: price,
                totalPrice: price
            }
        });
    }

    @Action(UpdatePickUpTime)
    updatePickUpTime({getState, setState}: StateContext<TakeAwayStateModel>, payload: string) {
        const state = getState();
        setState({
            ...state,
           timePickUp: payload
        });
    }

    @Action(CheckOutCart)
    checkoutCart({getState, setState}: StateContext<TakeAwayStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, CheckOutCart.name]
        });

        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == CheckOutCart.name), 1);

        return this.takeAwayService.checkOutCart("", state.cart).pipe(tap((result) => {
            if (result.success) {
                window.location.href = result.payload.url;
            }
            setState({
                ...state,
                actions: tempActions
            });
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
    }

    @Action(ClearCart)
    clearCart({getState, setState}: StateContext<TakeAwayStateModel>) {
        const state = getState();
        setState({
            ...state,
           timePickUp: null,
           cart: new CartDetail()
        });
    }

    @Action(UpdateReservationInfo)
    updateReservationInfo({getState, setState}: StateContext<TakeAwayStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            reservationInfo: {
                ...state.reservationInfo,
                day: new Date(payload.reservationInfo.day),
                hour: payload.reservationInfo.hour,
                noOfPeople: parseInt(payload.reservationInfo.numberOfPeople),
            }
        });
    }

    @Action(UpdateReservationBookerInfo)
    updateBookerReservationInfo({getState, setState}: StateContext<TakeAwayStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, UpdateReservationBookerInfo.name],
            reservationInfo: {
                ...state.reservationInfo,
                email: payload.reservationBookerInfo.email,
                lastName: payload.reservationBookerInfo.lastName,
                firstName: payload.reservationBookerInfo.firstName,
            }
        });

        const newState = getState();
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == UpdateReservationBookerInfo.name), 1);
        return this.takeAwayService.bookReservation(newState.reservationInfo).pipe(tap((result) => {            
            setState({
                ...state,
                actions: tempActions,
                reservationSuccess: result.success
            });
        }, error => {
            setState({
                ...state,
                actions: tempActions,
                reservationSuccess: false
            });
        }));
    }

    
    @Action(ClearReservation)
    clearReservation({getState, setState}: StateContext<TakeAwayStateModel>) {
        const state = getState();
        setState({
            ...state,
            reservationInfo: new CusReservation(),
            reservationSuccess: null
        });
    }
}