export type QualificationStatus =
  | "qualified"
  | "partial"
  | "not_now"
  | "not_eligible"
  | "do_not_contact";

export type NextAction = "whatsapp_link" | "human_callback" | "nurture" | "suppress";

export type Commitment = { type: string; when: string } | null;

export type CapturedRecord = {
  lead_id: string;
  call_id: string;
  contact_verified: boolean | null;
  product_interest: string | null;
  amount_sought: number | null;
  work_type: string | null;
  income_band: string | null;
  location_preference: string | null;
  document_readiness: boolean | null;
  commitment: Commitment;
  objections: string[];
  qualification_status: QualificationStatus | null;
  next_action: NextAction | null;
  consent_captured: boolean;
  disclosure_at: string | null;
  language: string;
};

export type Lead = {
  id: string;
  name: string;
  phoneMasked: string;
  city: string;
  product: string;
  source: string;
  language: string;
  priority: number;
  attempts: number;
  consent: boolean;
  dnd: boolean;
  formFields: Partial<CapturedRecord>;
  notes?: string;
};

export type Speaker = "agent" | "customer" | "system";

export type TurnMeta =
  | "disclosure"
  | "barge-in"
  | "opt-out"
  | "transfer"
  | "outcome"
  | "dnd-check"
  | "dial"
  | "connect";

export type Turn = {
  speaker: Speaker;
  text: string;
  ms: number;
  write?: Partial<CapturedRecord>;
  meta?: TurnMeta;
};

export type Scenario = {
  id: string;
  label: string;
  outcome: QualificationStatus;
  lead: Lead;
  turns: Turn[];
};

export type AuditEvent = {
  t: number;
  kind: string;
  detail: string;
};
