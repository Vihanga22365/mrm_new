import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface UploadDocumentResponse {
  status: string;
  message: string;
  path: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentUploadService {
  private readonly uploadUrl = `${environment.mrmBackendUrl}/uplaod_document`;

  constructor(private readonly http: HttpClient) {}

  uploadDocument(
    documentName: string,
    file: File,
  ): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('document_name', documentName);
    formData.append('document', file, file.name);

    return this.http.post<UploadDocumentResponse>(this.uploadUrl, formData);
  }
}
