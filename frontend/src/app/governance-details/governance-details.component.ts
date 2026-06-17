import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChapterRefineComponent } from './chapter-refine/chapter-refine.component';
import { ReviewDocumentComponent } from './review-document/review-document.component';
import { ChatHistoryWebsocketService } from '../services/chat-history-websocket.service';

type SectionType = 'refine' | 'review_document';

interface SearchResultItem {
  governance_id: string;
  use_case_title: string;
  use_case_description: string;
  user_name: string;
}

interface ChapterOption {
  name: string;
  description: string;
}

interface SelectSectionChapter {
  title: string;
  description: string;
}

interface SelectSectionTaskStep {
  step: 'SELECT_TARGET_CHAPTER_DROPDOWN' | 'GENERATE_CHAPTER_CONTENT' | string;
  action_type: 'select_value' | 'click_button' | string;
  value: string | null;
}

interface ReviewDocumentTaskStep {
  step: 'SELECT_ADDITIONAL_INSTRUCTION' | 'ASK_REVIEW_AGENT' | string;
  action_type: 'select_value' | 'click_button' | string;
  value: string | number | null;
}

@Component({
  selector: 'app-governance-details',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    ChapterRefineComponent,
    ReviewDocumentComponent,
  ],
  templateUrl: './governance-details.component.html',
  styleUrl: './governance-details.component.scss',
})
export class GovernanceDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ChapterRefineComponent)
  private chapterRefineComponent?: ChapterRefineComponent;

  isDarkTheme = false;
  activeSection: SectionType | null = null;

  searchGovernanceId = '';
  isSearching = false;
  isClearing = false;
  searchError = '';

  showSearchDropdown = false;
  searchResults: SearchResultItem[] = [];
  selectedSearchIndex = -1;
  chapterOptions: ChapterOption[] = [];
  reviewDocumentResponse: any = null;
  reviewDocumentTask: ReviewDocumentTaskStep[] | null = null;
  reviewDocumentSubSection: number | null = null;
  reviewDocumentTaskNonce = 0;

  private governanceDetailsSubscription?: Subscription;
  private pendingTaskSteps: SelectSectionTaskStep[] = [];

  constructor(
    private readonly chatHistoryWebsocketService: ChatHistoryWebsocketService,
  ) {}

  private readonly availableGovernanceItems: SearchResultItem[] = [
    {
      governance_id: 'GOV-2026-001',
      use_case_title: 'Customer Risk Profiling',
      use_case_description: 'Automated scoring and controls review.',
      user_name: 'Demo User',
    },
    {
      governance_id: 'GOV-2026-002',
      use_case_title: 'Claims Triage Assistant',
      use_case_description: 'Prioritization workflow governance checks.',
      user_name: 'Demo User',
    },
    {
      governance_id: 'GOV-2026-003',
      use_case_title: 'KYC Document Intelligence',
      use_case_description: 'Document handling and compliance visibility.',
      user_name: 'Demo User',
    },
  ];

  ngOnInit(): void {
    this.governanceDetailsSubscription = this.chatHistoryWebsocketService
      .getGovernanceDetailsUpdates()
      .subscribe((payload) => this.applySelectSectionPayload(payload));
  }

  ngOnDestroy(): void {
    this.governanceDetailsSubscription?.unsubscribe();
  }

  private applySelectSectionPayload(payload: any): void {
    if (payload?.section === 'review_document') {
      this.activeSection = 'review_document';

      const responsePayload = payload?.respone ?? payload?.response;
      if (responsePayload !== null && responsePayload !== undefined) {
        this.reviewDocumentResponse = responsePayload;
      }

      this.reviewDocumentTask = Array.isArray(payload?.task)
        ? (payload.task as ReviewDocumentTaskStep[])
        : null;
      this.reviewDocumentTaskNonce += 1;

      const subSectionRaw = payload?.sub_section;
      if (
        typeof subSectionRaw === 'number' &&
        Number.isInteger(subSectionRaw)
      ) {
        this.reviewDocumentSubSection = subSectionRaw;
      } else if (typeof subSectionRaw === 'string') {
        const parsed = Number.parseInt(subSectionRaw, 10);
        this.reviewDocumentSubSection = Number.isNaN(parsed) ? null : parsed;
      } else {
        this.reviewDocumentSubSection = null;
      }

      return;
    }

    if (payload?.section !== 'select_section') {
      return;
    }

    this.activeSection = 'refine';

    const taskSteps = this.extractTaskSteps(payload?.task);
    if (taskSteps.length > 0) {
      this.pendingTaskSteps = taskSteps;
      setTimeout(() => this.executePendingTaskSteps(), 0);
    }

    const responsePayload = payload?.respone ?? payload?.response;
    const chapters = responsePayload?.chapters;

    if (!Array.isArray(chapters)) {
      return;
    }

    const mapped = chapters
      .filter(
        (chapter: SelectSectionChapter) =>
          typeof chapter?.title === 'string' &&
          typeof chapter?.description === 'string',
      )
      .map((chapter: SelectSectionChapter) => ({
        name: chapter.title,
        description: chapter.description,
      }));

    if (mapped.length > 0) {
      this.chapterOptions = mapped;
      if (this.pendingTaskSteps.length > 0) {
        setTimeout(() => this.executePendingTaskSteps(), 0);
      }
    }
  }

  private extractTaskSteps(taskPayload: unknown): SelectSectionTaskStep[] {
    if (!Array.isArray(taskPayload)) {
      return [];
    }

    return taskPayload.filter(
      (step): step is SelectSectionTaskStep =>
        typeof step === 'object' &&
        step !== null &&
        'step' in step &&
        'action_type' in step &&
        'value' in step,
    );
  }

  private executePendingTaskSteps(): void {
    if (this.pendingTaskSteps.length === 0 || !this.chapterRefineComponent) {
      return;
    }

    const selectedStep = this.pendingTaskSteps.find(
      (step) =>
        step.step === 'SELECT_TARGET_CHAPTER_DROPDOWN' &&
        step.action_type === 'select_value' &&
        typeof step.value === 'string',
    );

    const shouldGenerate = this.pendingTaskSteps.some(
      (step) =>
        step.step === 'GENERATE_CHAPTER_CONTENT' &&
        step.action_type === 'click_button',
    );

    let isDropdownSelected = true;
    if (selectedStep?.value) {
      isDropdownSelected = this.chapterRefineComponent.selectChapterByValue(
        selectedStep.value,
      );
    }

    if (isDropdownSelected && shouldGenerate) {
      this.chapterRefineComponent.triggerGenerateChapterContent();
    }

    this.pendingTaskSteps = [];
  }

  setActiveSection(section: SectionType): void {
    this.activeSection = section;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  onSearchInput(searchTerm: string): void {
    const normalized = searchTerm.trim().toLowerCase();
    if (normalized.length < 2) {
      this.searchResults = [];
      this.showSearchDropdown = false;
      this.selectedSearchIndex = -1;
      return;
    }

    this.searchResults = this.availableGovernanceItems.filter(
      (item) =>
        item.governance_id.toLowerCase().includes(normalized) ||
        item.use_case_title.toLowerCase().includes(normalized) ||
        item.user_name.toLowerCase().includes(normalized),
    );
    this.showSearchDropdown = this.searchResults.length > 0;
    this.selectedSearchIndex = -1;
  }

  selectSearchResult(result: SearchResultItem): void {
    this.searchGovernanceId = result.governance_id;
    this.showSearchDropdown = false;
    this.searchResults = [];
    this.selectedSearchIndex = -1;
    this.searchGovernanceDetails();
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (!this.showSearchDropdown || this.searchResults.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSearchIndex = Math.min(
          this.selectedSearchIndex + 1,
          this.searchResults.length - 1,
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSearchIndex = Math.max(this.selectedSearchIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSearchIndex >= 0) {
          this.selectSearchResult(this.searchResults[this.selectedSearchIndex]);
        } else {
          this.searchGovernanceDetails();
        }
        break;
      case 'Escape':
        this.showSearchDropdown = false;
        this.selectedSearchIndex = -1;
        break;
    }
  }

  closeSearchDropdown(): void {
    setTimeout(() => {
      this.showSearchDropdown = false;
      this.selectedSearchIndex = -1;
    }, 150);
  }

  clearSearch(): void {
    this.isClearing = true;
    this.searchGovernanceId = '';
    this.searchError = '';
    this.showSearchDropdown = false;
    this.searchResults = [];
    this.selectedSearchIndex = -1;

    setTimeout(() => {
      this.isClearing = false;
    }, 200);
  }

  searchGovernanceDetails(): void {
    if (!this.searchGovernanceId.trim()) {
      this.searchError = 'Please enter a Governance ID to search.';
      return;
    }

    this.searchError = '';
  }
}
