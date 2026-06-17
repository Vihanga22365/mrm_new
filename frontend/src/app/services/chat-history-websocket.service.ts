import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatHistoryUpdate {
  type: 'chat_history_update';
  data: any;
}

export interface GovernanceDetailsUpdate {
  type: 'governance_details_update';
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryWebsocketService {
  private chatHistorySubject = new Subject<any>();
  private governanceDetailsSubject = new Subject<any>();
  private agentTriggerSubject = new Subject<string>();
  private manualChapterSelectionSubject = new Subject<string>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  private socket: WebSocket | null = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    const wsUrl = `${environment.mcpServerWsUrl}/ws`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.connectionStatusSubject.next(true);
      console.log('MCP WebSocket connected:', wsUrl);
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('MCP WebSocket response:', payload);

        if (
          (payload?.section === 'select_section' ||
            payload?.section === 'review_document') &&
          payload?.side === 'left'
        ) {
          this.emitGovernanceDetailsUpdate(payload);
          if (payload?.section === 'select_section') {
            this.emitAgentTriggerFromSelectSection(payload);
          }
        }
      } catch {
        console.log('MCP WebSocket response:', event.data);
      }
    };

    this.socket.onerror = () => {
      this.connectionStatusSubject.next(false);
    };

    this.socket.onclose = () => {
      this.connectionStatusSubject.next(false);
      setTimeout(() => this.connect(), 3000);
    };
  }

  /**
   * Parse chat history data to extract user query and document contents
   */
  private parseChatHistory(data: any): any {
    console.log('parseChatHistory input:', data);

    // Handle nested data structure
    let chatHistoryData = data;

    // New structure: data.chat_history.data.chat_history (from governance_details_update)
    if (data?.chat_history?.data?.chat_history) {
      chatHistoryData = data.chat_history.data;
    }
    // Old structure: data.data.chat_history (from chat_history_update)
    else if (data?.data?.chat_history) {
      chatHistoryData = data.data;
    }

    if (chatHistoryData?.chat_history?.events) {
      chatHistoryData.chat_history.events =
        chatHistoryData.chat_history.events.map((event: any) => {
          if (event.content?.parts?.[0]?.text) {
            const text = event.content.parts[0].text;

            // Extract <user_query> and <user_uploaded_document_contents> tags
            const userQueryMatch = text.match(
              /<user_query>\s*([\s\S]*?)\s*<\/user_query>/i,
            );
            const documentContentsMatch = text.match(
              /<user_uploaded_document_contents>\s*([\s\S]*?)\s*<\/user_uploaded_document_contents>/i,
            );

            event.content.userQuery = userQueryMatch
              ? userQueryMatch[1].trim()
              : null;

            // Parse multiple documents
            const documentsContent = documentContentsMatch
              ? documentContentsMatch[1].trim()
              : null;

            if (
              documentsContent &&
              documentsContent !== 'NO DOCUMENT CONTENT'
            ) {
              // Parse multiple documents separated by === markers
              const documentRegex =
                /===\s*([^=]+?)\s*Document Content Start\s*===([\s\S]*?)===\s*\1\s*Document Content End\s*===/gi;
              const documents = [];
              let match;

              while ((match = documentRegex.exec(documentsContent)) !== null) {
                documents.push({
                  name: match[1].trim(),
                  content: match[2].trim(),
                });
              }

              // If no documents were parsed with === format, treat entire content as single document
              if (documents.length > 0) {
                event.content.userUploadedDocuments = documents;
                event.content.userUploadedDocumentContents = null;
              } else {
                // Fallback: single document without === markers
                event.content.userUploadedDocumentContents = documentsContent;
                event.content.userUploadedDocuments = null;
              }
            } else {
              event.content.userUploadedDocuments = null;
              event.content.userUploadedDocumentContents = null;
            }

            // Check if user query is "NO USER QUERY"
            if (event.content.userQuery === 'NO USER QUERY') {
              event.content.userQuery = null;
            }
          }
          return event;
        });
    }

    console.log('parseChatHistory output:', chatHistoryData);
    return chatHistoryData;
  }

  /**
   * Build and emit the <target_chapter> agent message from a select_section payload
   */
  private emitAgentTriggerFromSelectSection(payload: any): void {
    const chapters: Array<{ title: string }> =
      payload?.respone?.chapters ?? payload?.response?.chapters ?? [];

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return;
    }

    const chapterList = chapters.map((ch) => ` ${ch.title}`).join('\n');

    const message = `<target_chapter>\n${chapterList}\n</target_chapter>`;
    this.agentTriggerSubject.next(message);
  }

  /**
   * Get observable for agent trigger messages (e.g. <target_chapter> after select_section)
   */
  getAgentTrigger(): Observable<string> {
    return this.agentTriggerSubject.asObservable();
  }

  getManualChapterSelectionTrigger(): Observable<string> {
    return this.manualChapterSelectionSubject.asObservable();
  }

  emitManualChapterSelectionTrigger(message: string): void {
    if (!message?.trim()) {
      return;
    }

    this.manualChapterSelectionSubject.next(message.trim());
  }

  /**
   * Get observable for chat history updates
   */
  getChatHistoryUpdates(): Observable<any> {
    return this.chatHistorySubject.asObservable();
  }

  /**
   * Get observable for governance details updates
   */
  getGovernanceDetailsUpdates(): Observable<any> {
    return this.governanceDetailsSubject.asObservable();
  }

  /**
   * Manually emit chat history data (for HTTP search results)
   */
  emitChatHistoryUpdate(data: any): void {
    const parsedData = this.parseChatHistory(data);
    this.chatHistorySubject.next(parsedData);
  }

  emitGovernanceDetailsUpdate(data: any): void {
    this.governanceDetailsSubject.next(data);
  }

  /**
   * Get observable for connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  /**
   * Send a message to the WebSocket server (if needed)
   */
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatusSubject.next(false);
  }
}
