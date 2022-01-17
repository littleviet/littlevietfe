import { CartProduct } from "../product/cart-product";

export class CartDetail {
    totalPrice: number = 0;
    subTotalPrice: number = 0;
    products: CartProduct[] = [];
}