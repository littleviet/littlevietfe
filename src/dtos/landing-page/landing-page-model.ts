import { CustomerProductType } from "../product-type/customer-product-type";
import { CusPackagedProduct } from "../product/cus-packaged-product";

export interface LandingPageModel {
    menuProducts: CustomerProductType[];
    packagedProducts: CusPackagedProduct[];
}
