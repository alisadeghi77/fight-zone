import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BracketAvailableKeysResponse, BracketGenerationResponse } from 'src/app/shared/models/bracket.models';
import { BaseResponseModel } from 'src/app/shared/models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class BracketHttpService {
  private baseUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAvailableKeys(competitionId: string): Observable<BracketAvailableKeysResponse> {
    return this.http.get<BracketAvailableKeysResponse>(`${this.baseUrl}/Bracket/available-keys/${competitionId}`);
  }

  generateBracketForKey(competitionId: string, key: string): Observable<BracketGenerationResponse> {
    return this.http.post<BracketGenerationResponse>(`${this.baseUrl}/Bracket/${competitionId}/${key}`, {});
  }

  generateAllBrackets(competitionId: string): Observable<BracketGenerationResponse> {
    return this.http.post<BracketGenerationResponse>(`${this.baseUrl}/Bracket/${competitionId}`, {});
  }

  deleteBracketForKey(competitionId: number, bracketKey: string): Observable<BaseResponseModel<any>> {
    return this.http.delete<BaseResponseModel<any>>(`${this.baseUrl}/Bracket/${competitionId}/${bracketKey}`);
  }

  deleteAllBrackets(competitionId: number): Observable<BaseResponseModel<any>> {
    return this.http.delete<BaseResponseModel<any>>(`${this.baseUrl}/Bracket/${competitionId}`);
  }
}
