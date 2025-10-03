export interface MatchDto {
  id: string;
  round: number;
  matchNumberPosition: number;
  firstParticipantId: number | null;
  firstParticipantFullName: string | null;
  firstParticipantCoachId: string | null;
  firstParticipantCoachFullName: string | null;
  isFirstParticipantBye: boolean;
  secondParticipantId: number | null;
  secondParticipantFullName: string | null;
  secondParticipantCoachId: string | null;
  secondParticipantCoachFullName: string | null;
  isSecondParticipantBye: boolean;
  winnerParticipantId: number | null;
  winnerParticipantFullName: string | null;
  winnerParticipantCoachId: string | null;
  winnerParticipantCoachFullName: string | null;
}

