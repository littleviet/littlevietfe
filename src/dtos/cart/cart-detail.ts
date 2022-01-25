import { CartServing } from "../serving/cart-serving";

export class CartDetail {
    totalPrice: number = 0;
    subTotalPrice: number = 0;
    servings: CartServing[] = [];
}