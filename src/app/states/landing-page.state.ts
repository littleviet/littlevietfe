import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { CustomerProductType } from 'src/dtos/customer-product-type';
import { GetProductMenu } from '../actions/landing-page.action';
import { LandingPageService } from '../services/landing-page.service';

export class LandingPageStateModel {
    productTypes: CustomerProductType[] = [];
}

@State<LandingPageStateModel>({
    name: 'landingpage',
    defaults: {
        productTypes: []
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

    @Action(GetProductMenu)
    getProductMenu({getState, setState}: StateContext<LandingPageStateModel>) : Observable<BaseResponse<CustomerProductType[]>> {
        return this.landingPageService.getProductMenu().pipe(tap((result) => {
            const state = getState();
            if (result.success) {
                setState({
                    ...state,
                    productTypes: result.payload
                });
            }
        }));
    }
}