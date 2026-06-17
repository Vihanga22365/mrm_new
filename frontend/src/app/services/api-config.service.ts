import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly AGENT_BASE_URL = environment.agenticApplicationUrl;
  private readonly BACKEND_API = `${environment.backendApiUrl}/governance`;
  private readonly USER_ID = environment.defaultUserId;

  constructor() {
    console.log('Agentic Application URL:', this.AGENT_BASE_URL);
    console.log('Backend API URL:', this.BACKEND_API);
    console.log('User ID:', this.USER_ID);
  }

  getBaseUrl(): string {
    return this.AGENT_BASE_URL;
  }

  getUserId(): string {
    return this.USER_ID;
  }

  getCreateSessionUrl(): string {
    return `${this.AGENT_BASE_URL}/sessions`;
  }

  getSessionRunUrl(sessionId: string): string {
    return `${this.AGENT_BASE_URL}/sessions/${sessionId}/run`;
  }

  getDocumentUploadUrl(sessionId: string): string {
    return `${this.BACKEND_API}/upload-multiple/${sessionId}`;
  }

  buildCreateSessionBody(sessionId: string, userName: string): any {
    return {
      session_id: sessionId,
      session_variables: {
        userName,
      },
    };
  }

  buildSessionRunBody(message: string): any {
    return {
      message,
    };
  }
}
