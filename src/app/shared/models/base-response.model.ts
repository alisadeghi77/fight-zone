export interface BaseResponseModel<T> {
    data: T;
    status: number;
    errorMessages: string[];
}
