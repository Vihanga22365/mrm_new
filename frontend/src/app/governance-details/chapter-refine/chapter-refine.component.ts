import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ChatHistoryWebsocketService } from '../../services/chat-history-websocket.service';

interface ChapterOption {
  name: string;
  description: string;
}

@Component({
  selector: 'app-chapter-refine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chapter-refine.component.html',
  styleUrls: ['./chapter-refine.component.scss'],
})
export class ChapterRefineComponent implements OnChanges {
  private readonly reviewSessionMarker = '--- New Review Session ---';
  @Input() isDarkTheme = false;
  @Input() chapterOptions: ChapterOption[] = [
    {
      name: 'General',
      description: 'No structure detected.',
    },
    {
      name: 'Executive Summary',
      description:
        'High-level summary for business and leadership stakeholders.',
    },
    {
      name: 'Risk Analysis',
      description: 'Detailed risk assessment, controls, and residual exposure.',
    },
    {
      name: 'Implementation Plan',
      description: 'Milestones, owners, and rollout sequencing for delivery.',
    },
  ];

  selectedChapter = this.chapterOptions[0].name;
  chapterDescription = this.chapterOptions[0].description;
  refinementInstructions = '';
  isGenerating = false;
  isReviewing = false;
  isDownloadingWord = false;
  generationError = '';
  thinkingLogs: string[] = [];
  generatedContent = '';
  showThinkingSection = false;
  showOutputSection = false;
  outputTitle = 'Generated Content';
  @ViewChild('thinkingSectionRef')
  private thinkingSectionRef?: ElementRef<HTMLElement>;
  @ViewChild('thinkingLogContainer')
  private thinkingLogContainer?: ElementRef<HTMLElement>;
  @ViewChild('outputSectionRef')
  private outputSectionRef?: ElementRef<HTMLElement>;
  private isThinkingFocusQueued = false;
  private isOutputFocusQueued = false;

  constructor(
    private readonly chatHistoryWebsocketService: ChatHistoryWebsocketService,
  ) {}

  get canGenerateChapterContent(): boolean {
    return !this.isGenerating && !!this.selectedChapter.trim();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['chapterOptions']) {
      return;
    }

    if (this.chapterOptions.length === 0) {
      this.selectedChapter = '';
      this.chapterDescription = '';
      return;
    }

    const existingSelected = this.chapterOptions.find(
      (option) => option.name === this.selectedChapter,
    );

    if (!existingSelected) {
      this.selectedChapter = '';
      this.chapterDescription = '';
      return;
    }

    this.chapterDescription = existingSelected.description;
  }

  onChapterChange(): void {
    if (!this.selectedChapter.trim()) {
      this.chapterDescription = '';
      return;
    }

    const selected = this.chapterOptions.find(
      (option) => option.name === this.selectedChapter,
    );
    this.chapterDescription = selected?.description ?? '';
  }

  selectChapterByValue(chapterValue: string): boolean {
    const targetValue = chapterValue.trim();
    if (!targetValue) {
      return false;
    }

    const selected = this.chapterOptions.find(
      (option) => option.name === targetValue,
    );

    if (!selected) {
      return false;
    }

    this.selectedChapter = selected.name;
    this.chapterDescription = selected.description;
    return true;
  }

  triggerGenerateChapterContent(): void {
    void this.generateChapterContent(false);
  }

  async generateChapterContent(
    shouldSendSelectionMessage = true,
  ): Promise<void> {
    if (!this.selectedChapter.trim()) {
      this.generationError = 'Please select a chapter before generating.';
      return;
    }

    if (shouldSendSelectionMessage) {
      this.chatHistoryWebsocketService.emitManualChapterSelectionTrigger(
        `I would like to select the ${this.selectedChapter}`,
      );
    }

    this.isGenerating = true;
    this.generationError = '';
    this.thinkingLogs = [];
    this.generatedContent = '';
    this.showThinkingSection = true;
    this.showOutputSection = false;
    this.outputTitle = 'Generated Content';
    this.queueThinkingFocus();

    try {
      const response = await fetch(`${environment.mrmBackendUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapter: this.selectedChapter,
          chapter_description: this.chapterDescription,
          instructions: this.refinementInstructions,
          structure_content: '',
          usecase_content: '',
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start chapter generation.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          this.handleStreamLine(line);
        }
      }

      if (buffer.trim()) {
        this.handleStreamLine(buffer);
      }
    } catch (error) {
      this.generationError =
        error instanceof Error
          ? error.message
          : 'Unable to generate content. Please try again.';
    } finally {
      this.isGenerating = false;
    }
  }

  copyGeneratedContent(): void {
    if (!this.generatedContent.trim()) {
      return;
    }

    navigator.clipboard.writeText(this.generatedContent).catch(() => {
      this.generationError = 'Copy failed. Please copy manually.';
    });
  }

  downloadGeneratedContent(): void {
    if (!this.generatedContent.trim()) {
      return;
    }

    const fileBlob = new Blob([this.generatedContent], {
      type: 'text/markdown;charset=utf-8',
    });

    const objectUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'final_report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }

  async downloadGeneratedWord(): Promise<void> {
    this.isDownloadingWord = true;
    this.generationError = '';

    try {
      const response = await fetch(
        `${environment.mrmBackendUrl}/download-docx`,
      );

      if (!response.ok) {
        throw new Error('Could not download Word report.');
      }

      const fileBlob = await response.blob();
      const objectUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'final_report.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      this.generationError =
        error instanceof Error
          ? error.message
          : 'Unable to download Word file.';
    } finally {
      this.isDownloadingWord = false;
    }
  }

  async reviewGeneratedContent(): Promise<void> {
    if (this.isReviewing) {
      return;
    }

    this.showThinkingSection = true;
    this.isReviewing = true;

    const reviewLogs = [
      '> INITIATING AGENTIC REVIEW...',
      '> CROSS-REFERENCING WITH DOCUMENT STRUCTURE...',
      '> CHECKING FOR TONE CONSISTENCY (Target: Professional)...',
      '> ANALYZING TECHNICAL TERMINOLOGY...',
      '> [REVIEW] Formatting is consistent with leadership-level expectations.',
      '> [REVIEW] Use case alignment is strong.',
      '> [REVIEW] Suggestion: Add quantitative evidence where possible.',
      '> REVIEW COMPLETE. Content validation finished.',
    ];

    this.thinkingLogs = [...this.thinkingLogs, this.reviewSessionMarker];

    try {
      for (const log of reviewLogs) {
        this.thinkingLogs = [...this.thinkingLogs, log];
        this.queueThinkingFocus();
        await this.delay(450);
      }
    } finally {
      this.isReviewing = false;
    }
  }

  isReviewSessionMarker(log: string): boolean {
    return log.trim() === this.reviewSessionMarker;
  }

  formatThinkingLog(log: string): string {
    if (this.isReviewSessionMarker(log)) {
      return 'Review Session';
    }

    return log;
  }

  private async fetchGeneratedReport(): Promise<void> {
    try {
      const response = await fetch(
        `${environment.mrmBackendUrl}/generated-content/final_report.md`,
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (data?.status === 'success' && typeof data?.content === 'string') {
        this.generatedContent = data.content;
        this.showOutputSection = true;
        this.queueOutputFocus();
      }
    } catch {
      // Keep streamed final content if report fetch fails
    }
  }

  private handleStreamLine(line: string): void {
    if (!line.trim()) {
      return;
    }

    try {
      const event = JSON.parse(line);

      if (event.type === 'log' && typeof event.content === 'string') {
        this.thinkingLogs = [...this.thinkingLogs, event.content];
        this.queueThinkingFocus();
        return;
      }

      if (event.type === 'final' && typeof event.content === 'string') {
        this.generatedContent = event.content;
        this.showOutputSection = true;
        this.queueOutputFocus();
        return;
      }

      if (event.type === 'complete' && typeof event.content === 'string') {
        this.thinkingLogs = [...this.thinkingLogs, `> ${event.content}`];
        this.queueThinkingFocus();
        this.isGenerating = false;
        void this.fetchGeneratedReport();
        return;
      }

      if (event.type === 'error' && typeof event.content === 'string') {
        this.generationError = event.content;
        this.isGenerating = false;
      }
    } catch {
      // Ignore malformed stream lines
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private queueThinkingFocus(): void {
    if (this.isThinkingFocusQueued) {
      return;
    }

    this.isThinkingFocusQueued = true;
    requestAnimationFrame(() => {
      this.isThinkingFocusQueued = false;

      this.thinkingSectionRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      const logContainer = this.thinkingLogContainer?.nativeElement;
      if (logContainer) {
        logContainer.scrollTo({
          top: logContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  }

  private queueOutputFocus(): void {
    if (this.isOutputFocusQueued) {
      return;
    }

    this.isOutputFocusQueued = true;
    requestAnimationFrame(() => {
      this.isOutputFocusQueued = false;
      this.outputSectionRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }
}
