import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface GovernanceDetailsResponse {
  governance_id: string;
  chat_history: any;
  governance_report: any;
  risk_details: any;
  cost_details: any;
  environment_details: any;
}

export interface SearchResultItem {
  created_at: string;
  governance_id: string;
  relevant_documents: any[];
  updated_at: string;
  use_case_description: string;
  use_case_title: string;
  user_chat_session_id: string;
  user_name: string;
  id: string;
}

export interface SearchResponse {
  message: string;
  searchTerm: string;
  data: SearchResultItem[];
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class GovernanceService {
  constructor() {}

  /**
   * Search for governance records by search term
   */
  searchGovernance(searchTerm: string): Observable<SearchResponse> {
    const normalized = (searchTerm || '').toLowerCase();
    const records: SearchResultItem[] = [
      {
        id: '1',
        governance_id: 'GOV-2026-001',
        use_case_title: 'Customer Risk Profiling',
        use_case_description: 'Automated scoring and controls review.',
        user_name: 'Demo User',
        user_chat_session_id: 'ui-session-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        relevant_documents: [],
      },
      {
        id: '2',
        governance_id: 'GOV-2026-002',
        use_case_title: 'Claims Triage Assistant',
        use_case_description: 'Prioritization workflow governance checks.',
        user_name: 'Demo User',
        user_chat_session_id: 'ui-session-2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        relevant_documents: [],
      },
    ].filter(
      (item) =>
        item.governance_id.toLowerCase().includes(normalized) ||
        item.use_case_title.toLowerCase().includes(normalized) ||
        item.user_name.toLowerCase().includes(normalized),
    );

    return of({
      message: 'UI-only search results',
      searchTerm,
      data: records,
      count: records.length,
    });
  }

  /**
   * Fetch all governance details for a given governance ID
   */
  fetchGovernanceDetails(
    governanceId: string,
  ): Observable<GovernanceDetailsResponse> {
    return of({
      governance_id: governanceId,
      chat_history: {
        data: {
          chat_history: {
            events: [],
          },
          governance_id: governanceId,
          user_name: 'Demo User',
        },
      },
      governance_report: {
        data: [
          {
            report_content:
              'UI-only mode is enabled. Governance content is static.',
            documents: [],
          },
        ],
      },
      risk_details: {
        data: [
          {
            risk_level: 'low',
            reason: 'Static placeholder risk reason.',
            committee_1: 'Pending',
            committee_2: 'Not Needed',
            committee_3: 'Not Needed',
          },
        ],
      },
      cost_details: {
        data: [
          {
            cost_breakdown: [
              { category: 'Compute', amount: 3000, description: 'Monthly' },
            ],
          },
        ],
      },
      environment_details: {
        data: [
          {
            environment: 'azure',
            region: 'East US',
            environment_breakdown: [
              { service: 'App Service', reason: 'Web hosting' },
            ],
          },
        ],
      },
    });
  }
}
