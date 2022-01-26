import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';
import { TakeAwayServing } from 'src/dtos/serving/take-away-serving';
import { CheckOutCart, GetTakeAwayProducts, UpdateCart, UpdatePickUpTime } from '../actions/take-away.action';
import { TakeAwayService } from '../services/take-away.service';

export class TakeAwayStateModel {
    products: TakeAwayProduct[] = [];
    cart!: CartDetail;
    timePickUp!: string | null;
    actions!: string[];
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
        actions: []
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
    static isCartEmpty(state: TakeAwayStateModel) {
        let totalItem = 0;
        if (state.cart && state.cart.servings && state.cart.servings.length > 0) {
            state.cart.servings.forEach(pro => {
                totalItem += pro.quantity;
            })
          }
          return totalItem <= 0;
    }

    @Action(GetTakeAwayProducts)
    getTakeAwayProducts({getState, setState}: StateContext<TakeAwayStateModel>) : Observable<BaseResponse<TakeAwayProduct[]>> {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, GetTakeAwayProducts.name]
        });
        return this.takeAwayService.getTakeAwayProductMenu().pipe(tap((result) => {
            let tempActions = [...state.actions];
            tempActions.splice( tempActions.findIndex(a => a == GetTakeAwayProducts.name), 1);
            if (result.success) {
                setState({
                    ...state,
                    products: result.payload,
                    actions: tempActions
                });
            }
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
        return this.takeAwayService.checkOutCart("", state.cart).pipe(tap((result) => {
            if (result.success) {
                window.location.href = result.payload.url;
            }
            let tempActions = [...state.actions];
            tempActions.splice( tempActions.findIndex(a => a == CheckOutCart.name), 1);
            setState({
                ...state,
                actions: tempActions
            });
        }));
    }
}