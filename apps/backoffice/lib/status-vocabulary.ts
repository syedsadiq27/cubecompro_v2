/**
 * Backoffice status vocabulary — locked from domain semantics.
 *
 * Domain product lifecycle (API):
 * | Code | Domain name   | List UI label | Filter bucket |
 * | 7    | Created       | Draft         | draft         |
 * | 8    | In progress   | Processing    | draft         |
 * | 9    | Cancelled     | Archived      | cancelled     |
 * | 10   | Unpublished   | Draft         | draft         |
 * | 11   | Published     | Active        | published     |
 * | 12   | Draft         | Draft         | draft         |
 *
 * List UI uses Active / Draft / Archived (Products reference).
 * Domain remain Published / Cancelled — do not invent Live/Ready synonyms.
 * "Needs attention" is commerce/config health, not lifecycle.
 */

export type StatusGrammarRole =
  | 'draft'
  | 'published'
  | 'cancelled'
  | 'processing'
  | 'needs_attention'
  | 'error'
  | 'archived'
  | 'neutral';

export const STATUS_VOCABULARY = {
  draft: 'Draft',
  published: 'Active',
  cancelled: 'Archived',
  processing: 'Processing',
  needs_attention: 'Needs attention',
  error: 'Failed',
  archived: 'Archived',
  neutral: 'Not configured',
} as const satisfies Record<StatusGrammarRole, string>;
