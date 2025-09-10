import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDto, LoginResponseDto, VerifyOtpRequestDto, VerifyOtpResponseDto, RefreshTokenResponseDto } from '../models/auth.models';
import { environment } from 'src/environments/environment';
import { BaseResponseDto } from '../models/competition.models';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private baseUrl = `${environment.baseApiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(request: LoginRequestDto): Observable<BaseResponseDto<LoginResponseDto>> {
    return this.http.post<BaseResponseDto<LoginResponseDto>>(`${this.baseUrl}/login`, request);
  }

  verify(request: VerifyOtpRequestDto): Observable<BaseResponseDto<VerifyOtpResponseDto>> {
    return this.http.post<BaseResponseDto<VerifyOtpResponseDto>>(`${this.baseUrl}/verify`, request);
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`, {});
  }
}