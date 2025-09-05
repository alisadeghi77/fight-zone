export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    expiresIn: number;
}

export interface RefreshTokenResponseDto {
    token: string;
    expiresIn: number;
}
