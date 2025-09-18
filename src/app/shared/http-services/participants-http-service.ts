import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponseModel } from "../models/base-response.model";
import { environment } from 'src/environments/environment';
import { ParticipantDto } from '../models/participant.models';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsHttpService {
  private baseUrl = `${environment.baseApiUrl}/Participant`;

  constructor(private http: HttpClient) { }

  getParticipants(competitionId: string): Observable<BaseResponseModel<ParticipantDto[]>> {
    return this.http.get<BaseResponseModel<ParticipantDto[]>>(`${this.baseUrl}?competitionId=${competitionId}`);
  }
}
