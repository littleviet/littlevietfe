import { AdminProduct } from "./admin-product";

export class AdminUpdateProductRequest {

  constructor(product: AdminProduct) {
    this.id = product.id;
    this.name = product.name;
    this.esName = product.esName;
    this.caName = product.caName;
    this.description = product.description;
    this.productTypeId = product.productType.id;
    this.status = product.status;
  }

  id!: string;
  name!: string;
  esName!: string;
  caName!: string;
  description!: string;
  productTypeId!: string;
  status!: string;
}
