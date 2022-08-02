import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from 'src/dtos/base-response';
import { LandingPageModel } from 'src/dtos/landing-page/landing-page-model';
import { CustomerProductType } from 'src/dtos/product-type/customer-product-type';
import { GetProductMenu } from '../actions/landing-page.action';
import { LandingPageService } from '../services/landing-page.service';

export class LandingPageStateModel {
    landingPageModel!: LandingPageModel | null;
    actions!: string[];
}

@State<LandingPageStateModel>({
    name: 'landingpage',
    defaults: {
        landingPageModel: null,
        actions: []
    }
})

@Injectable()
export class LandingPageState {

    constructor(private landingPageService: LandingPageService) {
    }

    @Selector()
    static getLandingPageModel(state: LandingPageStateModel) {
        return state.landingPageModel
    }

    @Selector()
    static getActions(state: LandingPageStateModel) {
        return state.actions;
    }

    @Action(GetProductMenu)
    getProductMenu({getState, setState}: StateContext<LandingPageStateModel>) : Observable<BaseResponse<LandingPageModel>> {
        const state = getState();
        setState({
            ...state,
            actions: [...state.actions, GetProductMenu.name]
        });
        let tempActions = [...state.actions];
        tempActions.splice( tempActions.findIndex(a => a == GetProductMenu.name), 1);
        return this.landingPageService.getLandingPageProduct().pipe(tap((result) => {
            if (result.success) {
                let menuProducts : CustomerProductType[] = [];
                result.payload.menuProducts.forEach( v => {
                    do {
                        let products = v.products.splice(0, 10);
                        menuProducts.push({
                            caName : v.caName,
                            esName : v.caName,
                            name : v.caName,
                            products : products
                        })
                    } while (v.products.length > 10)
                });
                result.payload.menuProducts = menuProducts;
                setState({
                    ...state,
                    landingPageModel: result.payload,
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
