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
    bannerImageId: number;
    date: string;
    address: string;
}

export interface UpdateCompetitionRequestDto {
    id: string;
    title: string;
    licenseImageId: number;
    bannerImageId: number;
    date: string;
    address: string;
}
