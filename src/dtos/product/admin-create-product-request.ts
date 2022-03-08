export interface AdminCreateProductRequest {
  name: string;
  esName: string;
  caName: string;
  description: string;
  productTypeId: string;
  mainImage: number;
  productImages: File[];
  status: string;
}
