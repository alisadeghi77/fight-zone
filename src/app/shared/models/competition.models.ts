export interface CompetitionDto {
    id: string;
    title: string;
    bannerImageId: number;
    licenseImageId: number;
    registerParams: CompetitionParam;
    date: string;
    address: string;
}

export interface CompetitionParam {
  key: string;
  title: string;
  values?: CompetitionParamValue[];
}

export interface CompetitionParamValue {
  key: string;
  title: string;
  params?: CompetitionParam[];
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
