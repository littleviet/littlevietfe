import { CustomerProduct } from "../product/customer-product";

export interface CustomerProductType {
    name: string;
    esName: string;
    caName: string;
    products: CustomerProduct[];
}