import { BaseResponse } from "./base-response";

export class PaginationResponse<T> implements BaseResponse<T> {
    pageNumber!: number;
    pageSize!: number;
    total!: number;
    message!: string;
    payload!: T;
    success!: boolean;
}