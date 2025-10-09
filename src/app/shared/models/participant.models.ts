export enum RegisterStatus {
    Pending,
    Approved,
    Rejected
}

export interface ParticipantParam {
    key: string,
    value: string,
}

export interface ParticipantDto {
    id: number;
    participantUserId: number;
    participantFullName: string;
    participantPhoneNumber: string;
    coachId: number;
    coachFullName: string;
    coachPhoneNumber: string;
    status?: RegisterStatus;
    registerParams?: ParticipantParam[];
    participantParamProperties: string
}


export interface CreateParticipantRequestByAdminDto {
    participantUserId:string,
    phoneNumber:string,
    firstName:string,
    lastName:string,
    coachUserId:string,
    coachPhoneNumber:string,
    competitionId:number,
    params : ParticipantParam[]
}