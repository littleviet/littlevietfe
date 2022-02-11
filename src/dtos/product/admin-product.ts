import { AdminProductType } from "../product-type/admin-product-type";
import { AdminServing } from "../serving/admin-serving";

export interface AdminProduct {
  id: string;
  name: string;
  esName: string;
  caName: string;
  description: string;
  producType: AdminProductType;
  servings: AdminServing[];
  status: string;
}
