export interface BaseResponseDto<T> {
    data: T, 
    status: number, 
    errorMessages: string[] 
}

export interface CompetitionDto {
    id: string;
    title: string;
    bannerImageId: number;
    licenseImageId: number;
    registerParams: string;
    date: string;
    address: string;
}

export interface CreateCompetitionRequestDto {
    title: string;
    licenseImageId: number;
    canRegister: boolean;
    bannerImageId: number;
    date: string;
    location: string;
}

export interface UpdateCompetitionRequestDto {
    id: string;
    title: string;
    licenseImageId: number;
    bannerImageId: number;
    date: string;
    address: string;
}
