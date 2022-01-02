export interface BaseResponse<T> {
    success: boolean;
    message: string;
    payload: T;
}