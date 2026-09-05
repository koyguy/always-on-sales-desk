export const kpis = {
  attempted: 1240,
  connected: 471,
  completed: 418,
  connectRate: 0.38,
  containment: 0.71,
  transfer: 0.12,
  p95: 0.94,
  qualRate: 0.221,
  costAi: 84,
  costHuman: 310,
  optOut: 0.008,
  complaint: 0.001,
};

export const connectByHour = [
  { hour: "09", rate: 22 },
  { hour: "10", rate: 31 },
  { hour: "11", rate: 38 },
  { hour: "12", rate: 29 },
  { hour: "13", rate: 24 },
  { hour: "14", rate: 36 },
  { hour: "15", rate: 41 },
  { hour: "16", rate: 39 },
  { hour: "17", rate: 34 },
  { hour: "18", rate: 28 },
  { hour: "19", rate: 18 },
];

export const funnel = [
  { stage: "Contacted", n: 1240 },
  { stage: "Connected", n: 471 },
  { stage: "Qualified", n: 104 },
  { stage: "Application", n: 61 },
  { stage: "Disbursal", n: 19 },
];

export const qualBySource = [
  { source: "Inbound", rate: 31 },
  { source: "Referral", rate: 27 },
  { source: "Partner", rate: 24 },
  { source: "Website", rate: 22 },
  { source: "Facebook", rate: 18 },
];

export const objections = [
  { reason: "Discuss with family", n: 38 },
  { reason: "Documents not on hand", n: 29 },
  { reason: "Comparing lenders", n: 21 },
  { reason: "Rate concern", n: 14 },
  { reason: "Already borrowed", n: 9 },
];

export const latencyBudget = [
  { stage: "Network and call transport", target: "100–150 ms", note: "In-region SIP only — a Twilio hop blows this" },
  { stage: "Speech-to-text", target: "150–300 ms", note: "Interim transcripts, not final-only" },
  { stage: "Conversation engine", target: "200–400 ms", note: "Short replies — no long-form mid-call" },
  { stage: "Text-to-speech first audio", target: "150–300 ms", note: "Streamed synthesis, not full-clip" },
  { stage: "Round trip", target: "< 1.2 s", note: "A single blocking stage breaks the budget" },
  { stage: "Barge-in on noisy mobile", target: "< 300 ms", note: "Voice-activity, not amplitude — ignore street noise" },
];

export const planes = [
  {
    id: "lead",
    n: "01",
    name: "Lead & data",
    job: "Every lead, its state, consent status and product config. The single source of truth.",
    owner: "Embifi",
    components: [
      "CRM or lead database",
      "Campaign lists",
      "Consent and DND registry",
      "Per-product config and field maps",
    ],
    notes: "Embifi's existing system wherever possible — integrated, not rebuilt. Nothing downstream keeps its own copy of the truth.",
  },
  {
    id: "orch",
    n: "02",
    name: "Orchestration",
    job: "Decides who is called, when and how often. Priority, scheduling, retries, throttling.",
    owner: "Embifi",
    components: [
      "Priority scoring",
      "Call scheduler and queue",
      "Retry ladder",
      "TRAI window, DLT and pre-dial DND scrub",
      "Provisioned concurrency / trunk caps",
      "Campaign rules",
    ],
    notes: "The layer missing from the earlier draft, and where most of the cost saving comes from. DND is checked immediately before every dial, not at list load. Concurrency is a paid trunk, not a software flag.",
  },
  {
    id: "conv",
    n: "03",
    name: "Conversation",
    job: "The live, interruptible, two-way call. Telephony, speech in, dialogue and slot state, speech out.",
    owner: "Co-create, or a TRAI-native vendor",
    vendor: true,
    components: [
      "Local SIP trunk (Exotel / Tata / Ozonetel)",
      "Noise-robust VAD and barge-in",
      "Streaming speech-to-text",
      "Conversation engine holding slot state",
      "Streaming text-to-speech",
      "Always-on workers — no cold start",
    ],
    notes: "Must run always-on. The only plane a third-party could sit — and the only plane whose unit cost currently loses to a human seat if you rent it. Twilio-through-US is disqualified on latency, price and TRAI routing.",
  },
  {
    id: "action",
    n: "04",
    name: "Action & write-back",
    job: "Turns the conversation into system state: CRM update, WhatsApp, human handoff.",
    owner: "Embifi",
    components: [
      "CRM write-back API",
      "WhatsApp dispatch",
      "Warm transfer or task creation",
      "Callback scheduling",
    ],
    notes: "Idempotent and retried — a failed write must never silently lose a qualified lead.",
  },
];

export const schemaFields = [
  { field: "lead_id / call_id", type: "string", description: "Links the call to the existing lead record; a call never creates an orphan." },
  { field: "contact_verified", type: "boolean", description: "Whether the intended person was actually reached." },
  { field: "product_interest", type: "string / null", description: "Product, plan or pricing tier the customer engaged with." },
  { field: "amount_sought", type: "number / null", description: "Loan or plan value discussed, where applicable." },
  { field: "work_type, income_band", type: "string / null", description: "Self-declared, flagged unverified, never a credit input." },
  { field: "location_preference", type: "string / null", description: "City, pickup hub, dealer or branch." },
  { field: "document_readiness", type: "boolean", description: "Customer confirms required documents are available." },
  { field: "commitment", type: "object / null", description: "Visit time, callback slot or app-download commitment." },
  { field: "objections", type: "array", description: "Structured reasons — feeds product and marketing, not just the agent." },
  { field: "qualification_status", type: "enum", description: "qualified / partial / not_now / not_eligible / do_not_contact — derived, never asked." },
  { field: "next_action", type: "enum", description: "whatsapp_link / human_callback / nurture / suppress." },
  { field: "consent_captured, metadata", type: "mixed", description: "Disclosure timestamp, language, duration, recording and transcript references." },
];
