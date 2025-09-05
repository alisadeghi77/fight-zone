import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadResponseDto, FileInfoDto } from '../models/files.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesHttpService {
  private baseUrl = `${environment.baseApiUrl}/files`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<FileUploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponseDto>(`${this.baseUrl}/upload`, formData);
  }

  getFileInfo(fileId: string): Observable<FileInfoDto> {
    return this.http.get<FileInfoDto>(`${this.baseUrl}/${fileId}`);
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fileId}`);
  }
}
