export interface CompetitionDto {
    id: string;
    title: string;
    manager: string;
    gender: string;
    canRegister: boolean;
    bannerImage: string;
    price: number;
    date: string;
    award: number;
    location: string;
}

export interface CreateCompetitionRequestDto {
    title: string;
    manager: string;
    gender: string;
    canRegister: boolean;
    bannerImage: string;
    price: number;
    date: string;
    award: number;
    location: string;
}

export interface UpdateCompetitionRequestDto {
    id: string;
    title: string;
    manager: string;
    gender: string;
    canRegister: boolean;
    bannerImage: string;
    price: number;
    date: string;
    award: number;
    location: string;
}
