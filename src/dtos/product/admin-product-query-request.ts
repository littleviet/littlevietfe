import { ProductStatus } from "src/commons/enums/app-enum";

export class AdminProductQueryRequest {
    esName: string | null = null;
    caName: string | null = null;
    name: string | null = null;
    statuses: ProductStatus[] | null = null;
    description: string | null = null;
    pageNumber: number | null = 1;
    pageSize: number | null = 10;
    orderBy: string | null = null;
}
