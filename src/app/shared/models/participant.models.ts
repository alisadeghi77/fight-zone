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
    participantParam?: ParticipantParam[];
}


export interface CreateParticipantRequestByAdminDto {
    participantId:string,
    phoneNumber:string,
    firstName:string,
    lastName:string,
    coachId:string,
    coachPhoneNumber:string,
    competitionId:number,
    params : ParticipantParam[]
}