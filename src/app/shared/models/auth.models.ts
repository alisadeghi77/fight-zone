export interface LoginRequestDto {
    phoneNumber: string;
}

export interface LoginResponseDto {
    message: string;
    success: boolean;
}

export interface VerifyOtpRequestDto {
    phoneNumber: string;
    otpCode: string;
}

export interface VerifyOtpResponseDto {
    token: string;
    userName: string;
    fullName: string;
}

export interface RefreshTokenResponseDto {
    token: string;
    expiresIn: number;
}
