import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface CreateSessionResponse {
  session_id: string;
  created_at: string;
  session_variables?: {
    userName?: string;
    [key: string]: unknown;
  };
}

export interface SessionChatResponse {
  session_id: string;
  response: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(
    private readonly http: HttpClient,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  createSession(
    sessionId: string,
    userName: string,
  ): Observable<CreateSessionResponse> {
    const url = this.apiConfigService.getCreateSessionUrl();
    const body = this.apiConfigService.buildCreateSessionBody(
      sessionId,
      userName,
    );

    return this.http.post<CreateSessionResponse>(url, body, {
      headers: this.jsonHeaders,
    });
  }

  sendMessage(
    sessionId: string,
    message: string,
  ): Observable<SessionChatResponse> {
    const url = this.apiConfigService.getSessionRunUrl(sessionId);
    const body = this.apiConfigService.buildSessionRunBody(message);

    return this.http.post<SessionChatResponse>(url, body, {
      headers: this.jsonHeaders,
    });
  }

  extractResponseText(response: any): string {
    if (response?.response && typeof response.response === 'string') {
      return response.response;
    }

    if (typeof response === 'string') {
      return response;
    }

    if (Array.isArray(response)) {
      for (let i = response.length - 1; i >= 0; i--) {
        const item = response[i];
        if (
          item?.content?.role === 'model' &&
          item?.content?.parts &&
          Array.isArray(item.content.parts)
        ) {
          // Find text part in the parts array
          for (const part of item.content.parts) {
            if (part?.text) {
              return part.text;
            }
          }
        }
      }
    }

    if (response?.text) {
      return response.text;
    }

    if (response?.content?.parts && Array.isArray(response.content.parts)) {
      for (const part of response.content.parts) {
        if (part?.text) {
          return part.text;
        }
      }
    }

    return JSON.stringify(response, null, 2);
  }
}
