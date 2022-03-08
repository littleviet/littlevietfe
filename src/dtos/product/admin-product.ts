import { AdminProductImage } from "../product-image/admin-product-image";
import { AdminProductType } from "../product-type/admin-product-type";
import { AdminServing } from "../serving/admin-serving";

export interface AdminProduct {
  id: string;
  name: string;
  esName: string;
  caName: string;
  description: string;
  productType: AdminProductType;
  servings: AdminServing[];
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
  status: string;
  productImages: AdminProductImage[];
}
