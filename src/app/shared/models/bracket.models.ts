export interface BracketKeyDto {
  key: string;
  hasAnyBrackets: boolean;
  title?: string; // optional title for display fill in frontend
}

export interface BracketAvailableKeysResponse {
  data: BracketKeyDto[];
  status: number;
  errorMessages: string[];
}

export interface BracketGenerationResponse {
  data: any;
  status: number;
  errorMessages: string[];
}
