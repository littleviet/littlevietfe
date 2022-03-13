import { ProductImage } from "../product-image/product-image";
import { TakeAwayServing } from "../serving/take-away-serving";

export interface TakeAwayProduct {
    id: string;
    name: string;
    esName: string;
    caName: string;
    price: number;
    productType: any;
    imageUrl: string;
    servings: TakeAwayServing[];
}