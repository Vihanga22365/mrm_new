import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface ReviewCommentItem {
  comment: string;
  report_text: string;
}

interface ReviewCommentViewModel extends ReviewCommentItem {
  additionalInstructions: string;
  resultText: string;
  isProcessing: boolean;
  actionLabel: string;
}

interface ReviewAutomationTaskStep {
  step: 'SELECT_ADDITIONAL_INSTRUCTION' | 'ASK_REVIEW_AGENT' | string;
  action_type: 'select_value' | 'click_button' | string;
  value: string | number | null;
}

@Component({
  selector: 'app-review-document',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-document.component.html',
  styleUrl: './review-document.component.scss',
})
export class ReviewDocumentComponent implements OnChanges {
  @Input() isDarkTheme = false;
  @Input() reviewResponse: any = null;
  @Input() automationTask: ReviewAutomationTaskStep[] | null = null;
  @Input() automationSubSection: number | null = null;
  @Input() automationNonce: number | null = null;

  comments: ReviewCommentViewModel[] = [];
  reviewError = '';
  private lastAutomationSignature = '';
  private pendingAutomation: {
    index: number;
    additionalInstruction: string;
  } | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviewResponse']) {
      const response = this.reviewResponse;

      if (!response) {
        this.comments = [];
        this.reviewError = '';
      } else if (typeof response?.error === 'string' && response.error.trim()) {
        this.comments = [];
        this.reviewError = response.error;
      } else {
        const incomingComments: ReviewCommentItem[] = Array.isArray(
          response?.comments,
        )
          ? response.comments
          : [];

        this.comments = incomingComments
          .filter(
            (item) =>
              typeof item?.comment === 'string' &&
              typeof item?.report_text === 'string',
          )
          .map((item) => ({
            comment: item.comment,
            report_text: item.report_text,
            additionalInstructions: '',
            resultText: '',
            isProcessing: false,
            actionLabel: 'Ask Review Agent',
          }));

        this.reviewError = '';
      }
    }

    if (
      changes['automationTask'] ||
      changes['automationSubSection'] ||
      changes['automationNonce']
    ) {
      this.captureAutomationTask();
    }

    this.tryApplyPendingAutomation();
  }

  get hasNoComments(): boolean {
    return !this.reviewError && this.comments.length === 0;
  }

  formatReportText(reportText: string): string {
    const markerRegex = />>([\s\S]*?)<</g;
    const highlighted = reportText.replace(
      markerRegex,
      '<span class="report-highlight">$1</span>',
    );

    if (highlighted !== reportText) {
      return highlighted;
    }

    return reportText
      .replace(/>>/g, '<span class="report-highlight">')
      .replace(/<</g, '</span>');
  }

  async processComment(
    comment: ReviewCommentViewModel,
    commentIndex: number,
  ): Promise<void> {
    if (comment.isProcessing) {
      return;
    }

    comment.isProcessing = true;
    comment.actionLabel = 'Processing...';
    comment.resultText = '';
    if (commentIndex >= 0 && this.comments[commentIndex] === comment) {
    } else {
      commentIndex = this.comments.indexOf(comment);
      if (commentIndex >= 0) {
      }
    }

    try {
      const response = await fetch(
        `${environment.mrmBackendUrl}/review-comment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comment_text: comment.comment,
            report_text: comment.report_text,
            additional_instructions: comment.additionalInstructions,
          }),
        },
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to process review comment.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let combinedText = '';
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
          if (!line.trim()) {
            continue;
          }

          try {
            const event = JSON.parse(line);

            if (event.type === 'token' && typeof event.content === 'string') {
              combinedText += event.content;
              comment.resultText = combinedText;
            } else if (
              event.type === 'error' &&
              typeof event.content === 'string'
            ) {
              comment.resultText = `Error: ${event.content}`;
            } else if (event.type === 'complete') {
              comment.actionLabel = 'Re-Ask Agent';
            }
          } catch {
            // Ignore malformed stream lines
          }
        }
      }

      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer);
          if (event.type === 'token' && typeof event.content === 'string') {
            comment.resultText += event.content;
          }
        } catch {
          // Ignore trailing malformed payload
        }
      }

      if (!comment.resultText.trim()) {
        comment.resultText = 'No response generated by review agent.';
      }
    } catch (error) {
      comment.resultText =
        error instanceof Error
          ? `System Error: ${error.message}`
          : 'System Error: Failed to process review comment.';
      comment.actionLabel = 'Retry';
    } finally {
      if (comment.actionLabel === 'Processing...') {
        comment.actionLabel = 'Re-Ask Agent';
      }
      comment.isProcessing = false;
    }
  }

  private captureAutomationTask(): void {
    if (
      !Array.isArray(this.automationTask) ||
      this.automationTask.length === 0
    ) {
      return;
    }

    const signature = JSON.stringify({
      task: this.automationTask,
      subSection: this.automationSubSection,
      nonce: this.automationNonce,
    });

    if (signature === this.lastAutomationSignature) {
      return;
    }

    this.lastAutomationSignature = signature;

    const additionalInstructionStep = this.automationTask.find(
      (step) =>
        step.step === 'SELECT_ADDITIONAL_INSTRUCTION' &&
        step.action_type === 'select_value' &&
        typeof step.value === 'string',
    );

    const askReviewStep = this.automationTask.find(
      (step) =>
        step.step === 'ASK_REVIEW_AGENT' && step.action_type === 'click_button',
    );

    let targetIndex: number | null = null;
    if (typeof askReviewStep?.value === 'number') {
      targetIndex = askReviewStep.value;
    } else if (typeof askReviewStep?.value === 'string') {
      const parsed = Number.parseInt(askReviewStep.value, 10);
      targetIndex = Number.isNaN(parsed) ? null : parsed;
    } else if (typeof this.automationSubSection === 'number') {
      targetIndex = this.automationSubSection;
    }

    if (targetIndex === null || targetIndex < 0) {
      return;
    }

    this.pendingAutomation = {
      index: targetIndex,
      additionalInstruction:
        typeof additionalInstructionStep?.value === 'string'
          ? additionalInstructionStep.value
          : '',
    };
  }

  private tryApplyPendingAutomation(): void {
    if (!this.pendingAutomation) {
      return;
    }

    const { index, additionalInstruction } = this.pendingAutomation;
    const targetComment = this.comments[index];
    if (!targetComment) {
      return;
    }

    targetComment.additionalInstructions = additionalInstruction;
    this.pendingAutomation = null;

    setTimeout(() => {
      void this.processComment(targetComment, index);
    }, 80);
  }
}
