export interface AuthFailedResponse {
    errors: string[];
}

export interface AuthSuccessResponse {
    token: string;
}
