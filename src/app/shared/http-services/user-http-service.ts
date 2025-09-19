import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponseModel } from "../models/base-response.model";
import { environment } from 'src/environments/environment';
import { MinimalUserDto, UserRoles } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {
  private baseUrl = `${environment.baseApiUrl}/User`;

  constructor(private http: HttpClient) { }

  getUsersByRole(phoneNumber: string, role: UserRoles): Observable<BaseResponseModel<MinimalUserDto[]>> {
    return this.http.get<BaseResponseModel<MinimalUserDto[]>>(`${this.baseUrl}/by-role?phoneNumber=${phoneNumber}&role=${role.toString()}`);
  }

}
