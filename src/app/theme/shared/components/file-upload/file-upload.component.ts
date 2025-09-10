import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilesHttpService } from 'src/app/shared/http-services/files-http-service';
import { FileUploadResponseDto } from 'src/app/shared/models/files.models';
import { environment } from 'src/environments/environment';
import { BaseResponseDto } from 'src/app/shared/models/competition.models';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent {
  @Input() extensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  @Input() showImage: boolean = true;
  @Input() maxFileSize: number = 5 * 1024 * 1024; // 5MB default
  @Output() fileUploaded = new EventEmitter<string>();

  selectedFile: File | null = null;
  uploadedFileId: string | null = null;
  isUploading: boolean = false;
  errorMessage: string = '';


  constructor(private filesHttpService: FilesHttpService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage = '';
    
    // Validate file type
    if (!this.isValidFileType(file)) {
      this.errorMessage = `Invalid file type. Allowed: ${this.extensions.join(', ')}`;
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.errorMessage = `File too large. Max: ${this.formatFileSize(this.maxFileSize)}`;
      return;
    }

    this.selectedFile = file;
    this.uploadFile();
  }

  private isValidFileType(file: File): boolean {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return fileExtension ? this.extensions.includes(fileExtension) : false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private uploadFile(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.errorMessage = '';

    this.filesHttpService.uploadFile(this.selectedFile).subscribe({
      next: (response: BaseResponseDto<FileUploadResponseDto>) => {
        debugger;
        this.uploadedFileId = response.data.id;
        this.isUploading = false;
        
        // Emit the file ID
        this.fileUploaded.emit(response.data.id);
        
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = 'Upload failed. Please try again.';
        console.error('File upload error:', error);
      }
    });
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadedFileId = null;
    this.errorMessage = '';
  }

  getAcceptedTypes(): string {
    return this.extensions.map(ext => `.${ext}`).join(',');
  }

  getFileUrl(fileId: string): string {
    return `${environment.baseApiUrl}/files/${fileId}`;
  }

  writeValue(value: string | null): void {
    this.uploadedFileId = value;
  }
}
