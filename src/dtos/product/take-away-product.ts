import { ProductImage } from "../product-image/product-image";

export interface TakeAwayProduct {
    id: string;
    name: string;
    esName: string;
    caName: string;
    price: number;
    productType: string;
    productTypeId: string;
    images: ProductImage[];
}