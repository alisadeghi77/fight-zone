export interface BracketKeyDto {
  key: string;
  hasAnyBrackets: boolean;
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
