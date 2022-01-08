import { ProductImage } from "../product-image/product-image";

export interface TakeAwayProduct {
    name: string;
    esName: string;
    caName: string;
    price: number;
    productTypeName: string;
    productTypeId: string;
    images: ProductImage[];
}