import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { marked } from 'marked';
import { ChatbotService } from '../services/chatbot.service';
import { DocumentUploadService } from '../services/document-upload.service';
import { ChatHistoryWebsocketService } from '../services/chat-history-websocket.service';
import { environment } from '../../environments/environment';

marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Attachment {
  id: number;
  name: string;
  sizeLabel: string;
  file: File;
}

type ExpectedDocumentType =
  | 'Document Stucture'
  | 'Document Stucture Document'
  | 'Use Case Description'
  | 'Technical Document'
  | 'Existing Content';

interface ChatMessage {
  id: number;
  author: string;
  timestamp: string;
  text: string;
  type: 'incoming' | 'outgoing';
  attachments?: Attachment[];
  html?: SafeHtml | null;
  responseTime?: number;
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.scss',
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  private agentTriggerSubscription?: Subscription;
  private manualChapterSelectionTriggerSubscription?: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private chatbotService: ChatbotService,
    private documentUploadService: DocumentUploadService,
    private chatHistoryWebsocketService: ChatHistoryWebsocketService,
  ) {}

  @ViewChild('userInputArea') userInputArea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messageList') messageList?: ElementRef<HTMLOListElement>;

  isDarkTheme = false;

  sessionId: string = this.generateUUID();
  userName = 'Lakshitha Rajapakse';
  userInitials = 'LR';

  readonly threadSummary = {
    title: 'Assistant AI',
    participants: ['You', 'Risk CoPilot'],
  };

  private messageCounter = 0;

  messages: ChatMessage[] = [];

  attachments: Attachment[] = [];
  isDragging = false;
  userInput = '';
  private attachmentCounter = 0;
  isAgentTyping = false;
  expectedDocumentType: ExpectedDocumentType | null = null;

  ngOnInit(): void {
    this.initializeSession();

    if (this.messages.length) {
      this.scrollToLatestMessage();
    }

    this.agentTriggerSubscription = this.chatHistoryWebsocketService
      .getAgentTrigger()
      .subscribe((message) => this.sendAgentTriggeredMessage(message));

    this.manualChapterSelectionTriggerSubscription =
      this.chatHistoryWebsocketService
        .getManualChapterSelectionTrigger()
        .subscribe((message) =>
          this.sendManualChapterSelectionMessage(message),
        );
  }

  ngOnDestroy(): void {
    this.agentTriggerSubscription?.unsubscribe();
    this.manualChapterSelectionTriggerSubscription?.unsubscribe();
  }

  get isSendDisabled(): boolean {
    return (
      this.isAgentTyping ||
      (!this.userInput.trim() && this.attachments.length === 0)
    );
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!this.isSendDisabled) {
        this.sendMessage();
      }
    }
  }

  getFileIconLabel(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'FILE';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    return ext.toUpperCase();
  }

  downloadAttachment(att: Attachment): void {
    const blob = new Blob([att.file], { type: att.file.type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || this.isAgentTyping) {
      input.value = '';
      return;
    }

    const validFiles = Array.from(input.files).filter((file) =>
      this.isValidFileType(file),
    );
    if (validFiles.length > 0) {
      this.addFiles(validFiles);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isAgentTyping) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.isAgentTyping) {
      return;
    }

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const validFiles = Array.from(files).filter((file) =>
        this.isValidFileType(file),
      );
      if (validFiles.length > 0) {
        this.addFiles(validFiles);
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = [
      'text/markdown',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExtensions = ['.md', '.docx'];

    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  }

  private addFiles(files: File[]): void {
    const existingNames = new Set(this.attachments.map((att) => att.name));
    const newAttachments = files
      .filter((file) => !existingNames.has(file.name))
      .map((file) => ({
        id: ++this.attachmentCounter,
        name: file.name,
        sizeLabel: this.formatFileSize(file.size),
        file,
      }));

    this.attachments = [...this.attachments, ...newAttachments];
    newAttachments.forEach((attachment) => {
      void this.logUploadedFileContent(attachment.file);
    });

    queueMicrotask(() => {
      this.userInputArea?.nativeElement.focus();
    });
  }

  private async logUploadedFileContent(file: File): Promise<void> {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      let content = '';

      if (extension === 'md') {
        content = await file.text();
      } else if (extension === 'pdf') {
        content = await this.extractPdfText(file);
      } else if (extension === 'docx') {
        content = await this.extractDocxText(file);
      } else if (extension === 'doc') {
        content = await this.extractDocTextFallback(file);
      }

      const startMarker = `------------------ ${file.name} Content Start ------------------`;
      const endMarker = `------------------ ${file.name} Content End -------------------`;
      console.log(`${startMarker}\n\n${content}\n\n${endMarker}`);
    } catch (error) {
      console.error(
        `Failed to read uploaded file content (${file.name})`,
        error,
      );
    }
  }

  private uploadDocument(file: File): void {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'unknown';
    const matchedDocumentType = this.detectDocumentTypeFromFileName(file.name);
    const resolvedDocumentType =
      this.expectedDocumentType ?? matchedDocumentType;

    console.log('uploadDocument function called');
    console.log('File type:', extension);
    console.log(
      'Expected document type:',
      this.expectedDocumentType ?? 'Not specified by chatbot yet',
    );
    console.log(
      'Uploaded document type:',
      matchedDocumentType ?? 'Could not infer from filename',
    );
    console.log(
      'Resolved document type (previous chatbot message first):',
      resolvedDocumentType ?? 'Could not resolve',
    );

    if (!resolvedDocumentType) {
      console.warn(
        'Skipping upload API call: document type could not be resolved.',
      );
      return;
    }

    const documentName = this.mapToBackendDocumentName(resolvedDocumentType);
    console.log('Upload API document_name:', documentName);

    this.documentUploadService.uploadDocument(documentName, file).subscribe({
      next: (response) => {
        console.log('Document uploaded successfully:', response);
      },
      error: (error) => {
        console.error('Document upload failed:', error);
      },
    });
  }

  private mapToBackendDocumentName(documentType: ExpectedDocumentType): string {
    if (
      documentType === 'Document Stucture' ||
      documentType === 'Document Stucture Document'
    ) {
      return 'document_stucture';
    }

    if (documentType === 'Use Case Description') {
      return 'usecase';
    }

    if (documentType === 'Existing Content') {
      return 'existing_content';
    }

    return 'technical_document';
  }

  private detectDocumentTypeFromFileName(
    fileName: string,
  ): ExpectedDocumentType | null {
    const normalizedName = fileName.toLowerCase();

    if (
      normalizedName.includes('document stucture') ||
      normalizedName.includes('document structure') ||
      normalizedName.includes('structure document')
    ) {
      return 'Document Stucture';
    }

    if (normalizedName.includes('use case description')) {
      return 'Use Case Description';
    }

    if (normalizedName.includes('technical document')) {
      return 'Technical Document';
    }

    if (normalizedName.includes('existing content')) {
      return 'Existing Content';
    }

    return null;
  }

  private updateExpectedDocumentTypeFromChatbotMessage(message: string): void {
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes('document stucture document') ||
      normalizedMessage.includes('document structure document') ||
      normalizedMessage.includes('document stucture') ||
      normalizedMessage.includes('document structure')
    ) {
      this.expectedDocumentType = 'Document Stucture';
      return;
    }

    if (normalizedMessage.includes('use case description')) {
      this.expectedDocumentType = 'Use Case Description';
      return;
    }

    if (normalizedMessage.includes('technical document')) {
      this.expectedDocumentType = 'Technical Document';
      return;
    }

    if (normalizedMessage.includes('existing content')) {
      this.expectedDocumentType = 'Existing Content';
    }
  }

  private async extractPdfText(file: File): Promise<string> {
    const pdfjs = await import('pdfjs-dist');
    const pdfjsAny = pdfjs as any;
    pdfjsAny.GlobalWorkerOptions.workerSrc = environment.pdfjsWorkerUrl;

    const data = await file.arrayBuffer();
    const loadingTask = pdfjsAny.getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    const pageBlocks: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const textItems = (textContent.items as any[])
        .map((item) => ({
          value: (item?.str ?? '').trim(),
          positionX: Number(item?.transform?.[4] ?? 0),
          positionY: Number(item?.transform?.[5] ?? 0),
          hasEndOfLine: Boolean(item?.hasEOL),
        }))
        .filter((item) => item.value.length > 0)
        .sort((first, second) => {
          const yDifference = second.positionY - first.positionY;
          if (Math.abs(yDifference) > 0.5) {
            return yDifference;
          }
          return first.positionX - second.positionX;
        });

      const lineMergeThreshold = 2;
      const pageLines: string[] = [];
      let currentLineY: number | null = null;
      let currentLineText = '';

      for (const item of textItems) {
        const isNewLineByPosition =
          currentLineY !== null &&
          Math.abs(item.positionY - currentLineY) > lineMergeThreshold;

        if (isNewLineByPosition && currentLineText.trim()) {
          pageLines.push(currentLineText.trim());
          currentLineText = '';
        }

        if (!currentLineText) {
          currentLineText = item.value;
          currentLineY = item.positionY;
        } else {
          const needsSpace = this.requiresSpaceBetweenTokens(
            currentLineText,
            item.value,
          );
          currentLineText = `${currentLineText}${needsSpace ? ' ' : ''}${item.value}`;
          currentLineY = item.positionY;
        }

        if (item.hasEndOfLine && currentLineText.trim()) {
          pageLines.push(currentLineText.trim());
          currentLineText = '';
          currentLineY = null;
        }
      }

      if (currentLineText.trim()) {
        pageLines.push(currentLineText.trim());
      }

      pageBlocks.push(pageLines.join('\n'));
    }

    return pageBlocks.join('\n\n').trim();
  }

  private requiresSpaceBetweenTokens(
    currentText: string,
    nextToken: string,
  ): boolean {
    if (!currentText || !nextToken) {
      return false;
    }

    const lastCharacter = currentText[currentText.length - 1];
    const firstCharacter = nextToken[0];
    const punctuationStarts = /^[,.;:!?%)\]\}]/;
    const noSpaceAfter = /[(\[\{\/$-]$/;

    if (punctuationStarts.test(firstCharacter)) {
      return false;
    }

    if (noSpaceAfter.test(lastCharacter)) {
      return false;
    }

    return true;
  }

  private async extractDocxText(file: File): Promise<string> {
    const mammothModule = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammothModule.extractRawText({ arrayBuffer });
    return result.value?.trim() ?? '';
  }

  private async extractDocTextFallback(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return decoder.decode(arrayBuffer).trim();
  }

  removeAttachment(id: number): void {
    this.attachments = this.attachments.filter((file) => file.id !== id);
  }

  sendMessage(): void {
    if (this.isSendDisabled) {
      return;
    }

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage = this.userInput.trim();
    const userHtml = this.convertMarkdownToHtml(userMessage);
    const userAttachments = this.attachments.length
      ? [...this.attachments]
      : undefined;

    if (userAttachments?.length) {
      userAttachments.forEach((attachment) => {
        this.uploadDocument(attachment.file);
      });
    }

    const outboundMessage = this.buildRunApiMessage(
      userMessage,
      userAttachments,
    );

    this.logSendAction(userMessage, userAttachments, outboundMessage);

    this.messages.push({
      id: this.nextMessageId(),
      author: 'You',
      timestamp: timeLabel,
      text: userMessage,
      type: 'outgoing',
      attachments: userAttachments,
      html: userHtml ?? undefined,
    });

    this.userInput = '';
    this.attachments = [];
    this.isAgentTyping = true;
    const requestStartedAt = Date.now();

    this.cdr.detectChanges();
    this.scrollToLatestMessage();

    this.chatbotService.sendMessage(this.sessionId, outboundMessage).subscribe({
      next: (response) => {
        const replyText = this.chatbotService.extractResponseText(response);
        this.updateExpectedDocumentTypeFromChatbotMessage(replyText);
        const replyHtml = this.convertMarkdownToHtml(replyText);
        const responseTime = Math.max(
          1,
          Math.round((Date.now() - requestStartedAt) / 1000),
        );

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
          responseTime,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
      error: () => {
        const replyText =
          'Unable to get a response from the chat service. Please try again.';
        const replyHtml = this.convertMarkdownToHtml(replyText);

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
    });
  }

  private logSendAction(
    message: string,
    attachments?: Attachment[],
    outboundMessage?: string,
  ): void {
    console.log('Send button clicked');
    console.log('Session:', this.sessionId);
    console.log('Message:', message);
    if (outboundMessage !== undefined) {
      console.log('Run API Message:', outboundMessage);
    }

    if (!attachments?.length) {
      console.log(`${this.sessionId} - No file attached`);
      return;
    }

    attachments.forEach((attachment) => {
      console.log(`${this.sessionId} - ${attachment.name}`);
    });
  }

  private buildRunApiMessage(
    message: string,
    attachments?: Attachment[],
  ): string {
    if (!attachments?.length) {
      return message;
    }

    const uploadedDocumentType =
      this.expectedDocumentType ??
      this.detectDocumentTypeFromFileName(attachments[0].name);

    if (!uploadedDocumentType) {
      return message;
    }

    return this.getUploadedDocumentMarker(uploadedDocumentType);
  }

  private getUploadedDocumentMarker(
    documentType: ExpectedDocumentType,
  ): string {
    if (
      documentType === 'Document Stucture' ||
      documentType === 'Document Stucture Document'
    ) {
      return '<Document Stucture Uploaded>';
    }

    if (documentType === 'Use Case Description') {
      return '<Use Case Description Uploaded>';
    }

    if (documentType === 'Existing Content') {
      return '<Existing Content Uploaded>';
    }

    return '<Technical Document Uploaded>';
  }

  /**
   * Invoked automatically when the WS service receives a select_section event.
   * Sends the <target_chapter> message to the agent and appends the reply to the chat.
   */
  private sendAgentTriggeredMessage(message: string): void {
    if (this.isAgentTyping) {
      return;
    }

    this.isAgentTyping = true;
    const requestStartedAt = Date.now();
    this.cdr.detectChanges();
    this.scrollToLatestMessage();

    this.chatbotService.sendMessage(this.sessionId, message).subscribe({
      next: (response) => {
        const replyText = this.chatbotService.extractResponseText(response);
        this.updateExpectedDocumentTypeFromChatbotMessage(replyText);
        const replyHtml = this.convertMarkdownToHtml(replyText);
        const responseTime = Math.max(
          1,
          Math.round((Date.now() - requestStartedAt) / 1000),
        );

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
          responseTime,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
      error: () => {
        const replyText =
          'Unable to get a response from the chat service. Please try again.';
        const replyHtml = this.convertMarkdownToHtml(replyText);

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
    });
  }

  private sendManualChapterSelectionMessage(message: string): void {
    if (!message?.trim() || this.isAgentTyping) {
      return;
    }

    const outgoingMessage = message.trim();
    const requestStartedAt = Date.now();

    this.messages.push({
      id: this.nextMessageId(),
      author: 'You',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: outgoingMessage,
      type: 'outgoing',
      html: this.convertMarkdownToHtml(outgoingMessage) ?? undefined,
    });

    this.isAgentTyping = true;
    this.cdr.detectChanges();
    this.scrollToLatestMessage();

    this.chatbotService.sendMessage(this.sessionId, outgoingMessage).subscribe({
      next: (response) => {
        const replyText = this.chatbotService.extractResponseText(response);
        this.updateExpectedDocumentTypeFromChatbotMessage(replyText);
        const replyHtml = this.convertMarkdownToHtml(replyText);
        const responseTime = Math.max(
          1,
          Math.round((Date.now() - requestStartedAt) / 1000),
        );

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
          responseTime,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
      error: () => {
        const replyText =
          'Unable to get a response from the chat service. Please try again.';
        const replyHtml = this.convertMarkdownToHtml(replyText);

        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: replyText,
          type: 'incoming',
          html: replyHtml ?? undefined,
        });

        this.isAgentTyping = false;
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
        queueMicrotask(() => {
          this.userInputArea?.nativeElement.focus();
        });
      },
    });
  }

  private scrollToLatestMessage(): void {
    setTimeout(() => {
      const container = this.messageList?.nativeElement;
      if (!container) {
        return;
      }

      const runScroll = () => {
        try {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        } catch {
          container.scrollTop = container.scrollHeight;
        }
      };

      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        requestAnimationFrame(runScroll);
      } else {
        runScroll();
      }
    }, 0);
  }

  private convertMarkdownToHtml(markdown: string): SafeHtml | null {
    if (!markdown || !markdown.trim()) {
      return null;
    }

    const rawHtml = marked.parse(markdown) as string;
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  createNewSession(): void {
    this.sessionId = this.generateUUID();
    this.attachments = [];
    this.userInput = '';
    this.messages = [];
    this.messageCounter = 0;

    this.initializeSession();
    this.cdr.detectChanges();
    this.scrollToLatestMessage();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  private nextMessageId(): number {
    return ++this.messageCounter;
  }

  private generateUUID(): string {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private initializeSession(): void {
    const newSessionId = this.generateUUID();
    this.sessionId = newSessionId;
    this.isAgentTyping = true;

    this.chatbotService.createSession(newSessionId, this.userName).subscribe({
      next: (sessionResponse) => {
        this.sessionId = sessionResponse?.session_id || newSessionId;
        this.isAgentTyping = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isAgentTyping = false;
        this.messages.push({
          id: this.nextMessageId(),
          author: 'Risk CoPilot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: 'Session creation failed. Please create a new session and try again.',
          type: 'incoming',
        });
        this.cdr.detectChanges();
      },
    });
  }

  private formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes === 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const power = Math.min(
      Math.floor(Math.log(sizeInBytes) / Math.log(1024)),
      units.length - 1,
    );
    const converted = sizeInBytes / Math.pow(1024, power);
    return `${converted.toFixed(converted >= 10 ? 0 : 1)} ${units[power]}`;
  }
}
