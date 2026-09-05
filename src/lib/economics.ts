export type StackId = "vendor" | "india" | "cocreate";

export type LineKey = "orch" | "tel" | "stt" | "tts" | "llm";

export const LINE_LABELS: Record<LineKey, string> = {
  orch: "Orchestration",
  tel: "Telephony (PSTN)",
  stt: "Speech-to-text",
  tts: "Text-to-speech",
  llm: "Conversation model",
};

export type Stack = {
  id: StackId;
  name: string;
  tag: string;
  summary: string;
  range: string;
  lines: Record<LineKey, number>;
  notes: string[];
};

/** Working midpoints, ₹ per connected minute. Q3 2026 published/reported ranges — not quotes. */
export const stacks: Stack[] = [
  {
    id: "vendor",
    name: "Vendor tax",
    tag: "Vapi / Retell + Twilio + ElevenLabs",
    summary:
      "Global managed stack. Fast to stand up, billed in dollars, routed through non-Indian media. Headline $0.05/min is orchestration only.",
    range: "₹10–18",
    lines: { orch: 4.25, tel: 1.35, stt: 0.8, tts: 2.8, llm: 0.8 },
    notes: [
      "Vapi lists $0.05/min platform; all-in with STT, TTS, LLM and Twilio typically $0.18–0.33.",
      "Twilio outbound to Indian mobiles ~₹1.20–1.50/min and adds 100–200 ms of extra hop.",
      "ElevenLabs-class TTS is the other fat line. Swap it and the minute still does not fall below ~₹8.",
    ],
  },
  {
    id: "india",
    name: "India platform",
    tag: "Bolna / similar + Exotel + BYOK",
    summary:
      "India-first orchestration with local SIP and your own Sarvam / Gemini keys. Cheaper than the global stack. Still a per-minute tax on every connected second.",
    range: "₹6–12",
    lines: { orch: 5.5, tel: 0.9, stt: 0.5, tts: 1.5, llm: 0.35 },
    notes: [
      "Bolna publishes 6.00¢/min (₹5.52), 4.51¢ at volume, billed in 30-second pulses. BYOK for LLM, TTS, ASR.",
      "Exotel outbound typically ₹0.80–1.00/min, TRAI-native, <50 ms regional media via AgentStream.",
      "Sarvam STT is ₹30/hour (₹0.50/min). Sarvam Bulbul realtime TTS is ₹3 per 1,000 characters.",
    ],
  },
  {
    id: "cocreate",
    name: "Co-create",
    tag: "LiveKit / Pipecat + Exotel SIP + Sarvam + Gemini",
    summary:
      "Own the pipeline. Buy only raw minutes, Indic speech APIs and GPU/CPU. Orchestration cost collapses to compute.",
    range: "₹3–6",
    lines: { orch: 0.25, tel: 0.8, stt: 0.5, tts: 1.5, llm: 0.35 },
    notes: [
      "LiveKit Agents / Pipecat self-hosted: orchestration ~₹0.15–0.40/min of compute, not a $0.05 platform fee.",
      "TTS is the line that refuses to vanish. At conversational density, Sarvam Bulbul is ~₹1.30–2.00 per connected minute of agent speech.",
      "Self-hosting Indic STT (AI4Bharat Conformer / Saaras on a GPU worker) can cut the ₹0.50 STT line to ~₹0.05–0.10. Treat ₹2 all-in as a later squeeze, not the opening bid.",
    ],
  },
];

export const stackById = Object.fromEntries(stacks.map((s) => [s.id, s])) as Record<
  StackId,
  Stack
>;

export function stackTotal(stack: Stack): number {
  return Object.values(stack.lines).reduce((a, b) => a + b, 0);
}

/** Loaded cost of a tier-2 sales agent, India, 2026. */
export const human = {
  loadedMonthly: 22_000,
  productiveDays: 22,
  productiveHours: 6,
  occupancy: 0.45,
  get connectedMinutes() {
    return this.productiveDays * this.productiveHours * 60 * this.occupancy;
  },
  get perMinute() {
    return this.loadedMonthly / this.connectedMinutes;
  },
};

export const defaults = {
  connectedMinutes: 12_000,
  qualRate: 0.22,
  ahtSeconds: 90,
};

export function model(input: {
  stackId: StackId;
  connectedMinutes: number;
  qualRate: number;
  ahtSeconds: number;
  earlyHangup: boolean;
}) {
  const stack = stackById[input.stackId];
  const minuteFactor = input.earlyHangup && input.stackId === "cocreate" ? 0.82 : 1;
  const billedMinutes = input.connectedMinutes * minuteFactor;
  const perMin = stackTotal(stack);
  const monthly = billedMinutes * perMin;
  const calls = input.connectedMinutes / (input.ahtSeconds / 60);
  const qualified = calls * input.qualRate;
  const perQualified = qualified > 0 ? monthly / qualified : 0;
  const agents = input.connectedMinutes / human.connectedMinutes;
  const humanMonthly = agents * human.loadedMonthly;
  const humanPerQualified = qualified > 0 ? humanMonthly / qualified : 0;
  return {
    stack,
    perMin,
    billedMinutes,
    monthly,
    calls,
    qualified,
    perQualified,
    agents,
    humanMonthly,
    humanPerQualified,
    humanPerMin: human.perMinute,
    deltaMonthly: monthly - humanMonthly,
  };
}

export const blindSpots = [
  {
    n: "01",
    title: "Telephony is a regulated product, not a library.",
    body: "Automated outbound in India sits under TRAI's TCCCPR. Principal-entity DLT registration, DND scrub immediately before every dial, commercial hours (09:00–21:00), and — for promotional voice — 140/160-series routing. Twilio-through-US for Indian mobiles is slower, dearer, and a filtering risk. Skipping DND scrub is fined; the scrub itself is paisa.",
  },
  {
    n: "02",
    title: "Barge-in that keys off volume will stall on a street.",
    body: "The sub-300 ms barge-in target is right. Amplitude-threshold VAD is not. Indian 4G calls carry traffic, fans, televisions, other speakers. A volume gate treats that as speech, cuts the agent mid-sentence, and the conversation dies. Voice-activity detection has to ignore non-vocal noise, and it has to be proven on Embifi's own mobile recordings, not a studio mic.",
  },
  {
    n: "03",
    title: "A human already costs about six rupees a minute.",
    body: "A loaded tier-2 sales seat is ~₹22,000 a month. At 45% occupancy that is ~3,560 connected minutes, or ~₹6.20 per connected minute. A ₹10–15 AI minute does not win on rate. It wins on time-to-first-call, nights and Sundays, campaign spikes, and the fact that the human is reserved for a lead already known to be interested.",
  },
  {
    n: "04",
    title: "Fifty simultaneous dials are not a software throttle.",
    body: "Orchestration can decide to launch a campaign. The trunk has to exist. Local SIP and AI workers enforce hard concurrency — paid, pre-provisioned channels and worker replicas, with CPM caps (Exotel defaults to 200 calls/min per trunk). A spike that looks free in the scheduler is a capacity order placed last week.",
  },
];

export const vendorQuestions = [
  {
    q: "Do you terminate Indian mobiles on a TRAI-compliant local SIP trunk (Exotel, Tata, Ozonetel), or are we hairpinning through Twilio?",
    why: "The extra hop is 100–200 ms and 40% on the telephony line. It is also how carriers decide you look like a spam dialler.",
  },
  {
    q: "Show barge-in accuracy on a recorded Indian mobile call with street noise — not a headset in a quiet room.",
    why: "If VAD keys off energy, the agent will halt for honks and keep talking over the customer. This is a production-failure mode, not a demo polish item.",
  },
  {
    q: "With our own Sarvam and Gemini keys plus Exotel minutes, what is the contractual all-in ₹ per connected minute at 12k, 40k and 100k minutes?",
    why: "Headline $0.05 is orchestration. The minute the CFO sees is the stack. Get it in writing, pulse-billed the way they invoice (30s vs 60s).",
  },
  {
    q: "For 50 simultaneous outbound legs, what is the per-channel reservation, and what does your API do when we exceed it?",
    why: "Dropped live calls at the cap are worse than a queue. Rate-limit behaviour is part of the product, not an error code.",
  },
  {
    q: "Can the agent call our write-back API mid-call, transfer to a human with full context, and export raw audio plus timestamps into Embifi's store?",
    why: "If any of the three fail, the platform is disqualified — live CRM, warm handoff and audit are the system, not extras.",
  },
];

export const coCreateSplit = {
  embifi: [
    "Exotel / Tata / Ozonetel SIP contracts and DLT principal-entity registration.",
    "Existing GCP / AWS project — workers run next to the CRM, not in a vendor VPC.",
    "Plane 1 and Plane 4: lead store, consent, product config, WhatsApp, human tasks.",
    "Scripts, qualification rules, permitted-statement tables, calling windows.",
  ],
  together: [
    "LiveKit Agents or Pipecat pipeline: SIP ↔ VAD ↔ STT ↔ Gemini ↔ TTS, always-on workers.",
    "Silero (or equivalent) VAD tuned on Embifi's own noisy mobile recordings.",
    "Early hangup: voicemail, dead air, hostility — cut within ~20 seconds, do not bill a two-minute FAQ on a machine.",
    "Mid-call write-back to Embifi's API, barge-in, human transfer, redaction before storage.",
  ],
};

export const coCreateSteps = [
  {
    n: "01",
    title: "Kill the $0.05/min tax",
    body: "Orchestration is a worker that shuttles audio. LiveKit Agents (concurrency, sub-100 ms transport) or Pipecat (Python, fast vendor swaps) on Embifi's cloud. Compute, not a platform minute.",
  },
  {
    n: "02",
    title: "Direct SIP, not a global CPaaS",
    body: "Terminate on Exotel / Tata / Ozonetel. TRAI-native numbers, DND scrub in the pre-dial path, media in-region. Outbound falls to ~₹0.80–1.00, and often lower on a committed trunk.",
  },
  {
    n: "03",
    title: "Indic speech as a commodity",
    body: "Sarvam Saaras realtime STT (₹30/hour) and Bulbul v3 TTS (₹3 / 1,000 chars, 11 Indian languages, code-switch without a language-boundary glitch). Gemini Flash already sits in Embifi's AI Studio footprint for the dialogue turn.",
  },
  {
    n: "04",
    title: "Pay only when a human is speaking",
    body: "VAD gates the expensive layers. Dial tone, voicemail, street noise and hold music must not trigger TTS or the LLM. This is the largest behavioural saving in the stack — larger than any vendor discount.",
  },
];

export const scorecard = [
  { label: "Hinglish recognition on Embifi audio", w: 25, gate: false },
  { label: "Field capture above 95% on a fixed set", w: 20, gate: false },
  { label: "p95 round trip under 1.2s with noise-robust barge-in", w: 15, gate: false },
  { label: "Mid-call API, human transfer, raw export", w: 15, gate: true },
  { label: "TRAI-native SIP + pre-dial DND scrub", w: 0, gate: true },
  { label: "All-in ₹/min at expected and peak volume", w: 15, gate: false },
  { label: "Time to pilot versus exit cost", w: 10, gate: false },
];
