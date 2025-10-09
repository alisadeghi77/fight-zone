import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponseModel } from '../models/base-response.model';
import { MatchDto } from '../models/match.models';

@Injectable({
  providedIn: 'root'
})
export class MatchHttpService {
  private baseUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getMatchesByKey(key: string): Observable<BaseResponseModel<MatchDto[]>> {
    return this.http.get<BaseResponseModel<MatchDto[]>>(`${this.baseUrl}/Match/${key}`);
  }

  setMatchWinner(matchId: string, participantId: number): Observable<BaseResponseModel<any>> {
    return this.http.post<BaseResponseModel<any>>(`${this.baseUrl}/Match`, {
      matchId,
      participantId
    });
  }
}
