import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CustomerCouponType } from 'src/dtos/coupon-type/customer-coupon-type';
import { CustomerCouponRequest } from 'src/dtos/coupon/customer-coupon-request';
import { CheckoutCoupon, GetCouponTypes, UpdateCouponBuyingInfo } from '../actions/coupon.action';
import { GetTakeAwayProducts } from '../actions/take-away.action';
import { CouponService } from '../services/coupon.service';

export class CouponStateModel {
    couponTypes!: CustomerCouponType[];
    couponBuying!: CustomerCouponRequest;
    couponBuyingSuccess!: boolean | null;
    actions!: string[];
}

@State<CouponStateModel>({
    name: 'coupon',
    defaults: {
        couponTypes: [],
        couponBuying: new CustomerCouponRequest(),
        couponBuyingSuccess: null,
        actions: [],
    }
})

@Injectable()
export class CouponState {

    constructor(private couponService: CouponService) {
    }

    @Selector()
    static getCouponTypes(state: CouponStateModel) {
        return state.couponTypes;
    }

    @Selector()
    static getCouponBuyingInfo(state: CouponStateModel) {
        return state.couponBuying;
    }

    @Selector()
    static getActions(state: CouponStateModel) {
        return state.actions;
    }

    @Selector()
    static isCouponBuyingSuccess(state: CouponStateModel) {
          return state.couponBuyingSuccess;
    }

    @Action(GetCouponTypes)
    getCouponTypes({getState, setState}: StateContext<CouponStateModel>) : Observable<BaseResponse<CustomerCouponType[]>> {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, GetCouponTypes.name]
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == GetTakeAwayProducts.name), 1);
        return this.couponService.getCouponTypes().pipe(tap((result) => {
            if (result.success) {
                setState({
                    ...state,
                    couponTypes: result.payload,
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

    @Action(UpdateCouponBuyingInfo)
    updateReservationInfo({getState, setState}: StateContext<CouponStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            couponBuying: {
                ...state.couponBuying,
                couponTypeId: payload.couponBuyingInfo.couponTypeId,
                quantity: payload.couponBuyingInfo.unit
            }
        });
    }

    @Action(CheckoutCoupon)
    checkoutCoupon({getState, setState}: StateContext<CouponStateModel>, payload: any) {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, CheckoutCoupon.name],
            couponBuying: {
                ...state.couponBuying,
                email: payload.couponBuyerInfo.email,
                lastName: payload.couponBuyerInfo.lastName,
                firstName: payload.couponBuyerInfo.firstName,
                phoneNumber: payload.couponBuyerInfo.phoneNumber
            }
        });

        const newState = getState();
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == CheckoutCoupon.name), 1);
        return this.couponService.buyCoupon(newState.couponBuying).pipe(tap((result) => {      
            if (result.success) {
                window.location.href = result.payload.url;
            }      
            setState({
                ...state,
                actions: tempActions,
            });
        }, error => {
            setState({
                ...state,
                actions: tempActions,
            });
        }));
    }
}