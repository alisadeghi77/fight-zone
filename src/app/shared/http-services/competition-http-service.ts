import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompetitionDto, CreateCompetitionRequestDto, UpdateCompetitionRequestDto } from '../models/competition.models';
import { BaseResponseModel } from "../models/base-response.model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetitionHttpService {
  private baseUrl = `${environment.baseApiUrl}/competition`;

  constructor(private http: HttpClient) { }

  getCompetitions(): Observable<BaseResponseModel<CompetitionDto[]>> {
    return this.http.get<BaseResponseModel<CompetitionDto[]>>(`${this.baseUrl}`);
  }

  getCompetitionById(id: string): Observable<BaseResponseModel<CompetitionDto>> {
    return this.http.get<BaseResponseModel<CompetitionDto>>(`${this.baseUrl}/${id}`);
  }

  createCompetition(request: CreateCompetitionRequestDto): Observable<BaseResponseModel<CompetitionDto>> {
    return this.http.post<BaseResponseModel<CompetitionDto>>(`${this.baseUrl}`, request);
  }

  updateCompetition(request: UpdateCompetitionRequestDto): Observable<BaseResponseModel<CompetitionDto>> {
    return this.http.put<BaseResponseModel<CompetitionDto>>(`${this.baseUrl}`, request);
  }

  updateCompetitionParams(id: string, request: string): Observable<CompetitionDto> {
    return this.http.put<CompetitionDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteCompetition(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
