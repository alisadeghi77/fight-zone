import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponseDto, CompetitionDto, CreateCompetitionRequestDto, UpdateCompetitionRequestDto } from '../models/competition.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetitionHttpService {
  private baseUrl = `${environment.baseApiUrl}/competition`;

  constructor(private http: HttpClient) { }

  getCompetitions(): Observable<BaseResponseDto<CompetitionDto[]>> {
    return this.http.get<BaseResponseDto<CompetitionDto[]>>(`${this.baseUrl}`);
  }

  getCompetitionById(id: string): Observable<CompetitionDto> {
    return this.http.get<CompetitionDto>(`${this.baseUrl}/${id}`);
  }

  createCompetition(request: CreateCompetitionRequestDto): Observable<CompetitionDto> {
    return this.http.post<CompetitionDto>(`${this.baseUrl}`, request);
  }

  updateCompetition(id: string, request: UpdateCompetitionRequestDto): Observable<CompetitionDto> {
    return this.http.put<CompetitionDto>(`${this.baseUrl}/${id}`, request);
  }

  updateCompetitionParams(id: string, request: string): Observable<CompetitionDto> {
    return this.http.put<CompetitionDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteCompetition(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
