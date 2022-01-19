import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CartDetail } from 'src/dtos/cart/cart-detail';
import { TakeAwayProduct } from 'src/dtos/product/take-away-product';
import { GetTakeAwayProducts, UpdateCart, UpdatePickUpTime } from '../actions/take-away.action';
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
            products: [],
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
        const index = state.products.findIndex(p => p.id == payload.productId);
        let cloneProducts = _.cloneDeep(state.cart.products);

        const existed = cloneProducts.findIndex(p => p.id == payload.productId);

        if (existed >= 0) {
            cloneProducts[existed].price = state.products[index].price;
            cloneProducts[existed].quantity += payload.quantity;
            setState({
                ...state,
                cart: {
                    ...state.cart,
                    products: cloneProducts
                }
            });
        } else {
            cloneProducts.push({
                caName: state.products[index].caName,
                esName: state.products[index].esName,
                name: state.products[index].name,
                quantity: payload.quantity,
                price: state.products[index].price,
                id: state.products[index].id
            });
        }
        cloneProducts =  cloneProducts.filter( pro => { return pro.quantity != 0; }); 
        let price = 0;
        cloneProducts.forEach(pro => {
            price += pro.price * pro.quantity;
        });
        setState({
            ...state,
            cart: {
                ...state.cart,
                products: cloneProducts,
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
}