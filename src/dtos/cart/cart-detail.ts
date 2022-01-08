import { CartProduct } from "../product/cart-product";

export interface CartDetail {
    totalPrice: number;
    subTotalPrice: number;
    products: CartProduct[];
}