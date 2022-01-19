import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';
import { GetProductMenu } from '../actions/landing-page.action';
import { LandingPageService } from '../services/landing-page.service';

export class LandingPageStateModel {
    productTypes: CustomerProductType[] = [];
    actions!: string[];
}

@State<LandingPageStateModel>({
    name: 'landingpage',
    defaults: {
        productTypes: [],
        actions: []
    }
})

@Injectable()
export class LandingPageState {

    constructor(private landingPageService: LandingPageService) {
    }

    @Selector()
    static getProductMenu(state: LandingPageStateModel) {
        return state.productTypes
    }

    @Selector()
    static getActions(state: LandingPageStateModel) {
        return state.actions;
    }

    @Action(GetProductMenu)
    getProductMenu({getState, setState}: StateContext<LandingPageStateModel>) : Observable<BaseResponse<CustomerProductType[]>> {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, GetProductMenu.name]
        });
        return this.landingPageService.getProductMenu().pipe(tap((result) => {
            let tempActions = [...state.actions];
            tempActions.splice( tempActions.findIndex(a => a == GetProductMenu.name), 1);
            if (result.success) {
                setState({
                    ...state,
                    productTypes: result.payload,
                    actions: tempActions
                });
            }
        }));
    }
}