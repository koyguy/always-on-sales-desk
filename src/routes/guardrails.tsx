import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/guardrails")({ component: GuardrailsPage });

const CATEGORIES = [
  {
    title: "Telecom compliance",
    rules: [
      "Embifi is registered as a principal entity on the operator DLT platforms before the first commercial dial.",
      "Every outbound number is scrubbed against the live DND registry immediately before the dial — not at list load.",
      "Commercial calls stay inside 09:00–21:00 IST unless a tighter product window is configured. Promotional voice uses 140/160-series routing.",
      "Scrub reports and consent markers are retained for two years. One internal opt-out suppresses the number across all campaigns within seconds.",
      "Indian mobiles terminate on a TRAI-compliant local SIP trunk. Global CPaaS hairpins are out of policy.",
    ],
  },
  {
    title: "Contact discipline",
    rules: [
      "Attempt caps per lead per campaign, and a single conversation per lead per day.",
      "Concurrency is a provisioned trunk and worker replica, not a scheduler flag. A campaign may not exceed paid channels.",
      "Consent is checked in the same pre-dial pass as DND.",
    ],
  },
  {
    title: "Conversation conduct",
    rules: [
      "The opening line discloses an AI assistant calling on behalf of Embifi, states the purpose, and why the customer is being contacted.",
      "Barge-in is voice-activity based, tuned on noisy Indian mobile recordings — not an amplitude gate.",
      "A refusal is honoured on the first clear signal, with at most one polite clarifying question and no rebuttal loop.",
      "A request for a human is always granted, never deflected.",
    ],
  },
  {
    title: "What the agent may say",
    rules: [
      "Only pricing, fees, eligibility and offers that come from the product configuration.",
      "No bespoke term calculation, no negotiation, and no indication that a loan is approved.",
      "Approval and final terms are always subject to lender review.",
      "No financial advice or lender comparisons.",
      "Questions outside the configured FAQ set escalate rather than get improvised on.",
    ],
  },
  {
    title: "Data and privacy",
    rules: [
      "No verbal collection of sensitive identifiers.",
      "Automatic redaction before storage.",
      "Consent timestamped on every call.",
      "Recordings and transcripts encrypted at rest with a defined retention period, logged, role-based access.",
    ],
  },
  {
    title: "Failure handling",
    rules: [
      "Low recognition confidence triggers a confirm-back before any field is written.",
      "Two failed attempts to understand escalate rather than loop.",
      "Silence, heavy noise or a dropped stream produce a graceful exit and a human follow-up task — never dead air.",
      "Voicemail, dial tone and hold music hang up within about 20 seconds. They must not trigger TTS or the LLM.",
    ],
  },
];

const OUTCOMES = [
  { name: "Qualified", body: "Core fields plus a commitment → WhatsApp link, human task, calling stops." },
  { name: "Partial", body: "Interest but missing fields → nurture and one scheduled retry." },
  { name: "Not now", body: "Not in-market yet → parked with a review date." },
  { name: "Not eligible", body: "Closed with a reason code that feeds back into targeting." },
  { name: "Do not contact", body: "Suppressed permanently across all campaigns." },
];

function GuardrailsPage() {
  return (
    <AppShell>
      <p className="font-mono text-xs tracking-[0.2em] text-muted">GUARDRAIL PLANE</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
        Scaling calls without damaging the brand — or the licence.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        An automated dialler is capable of annoying thousands of people per hour,
        and of being fined for it. Guardrails are a product requirement, not a
        compliance afterthought, and are enforced in the orchestration and
        action planes — outside the language model.
      </p>

      <div className="mt-10 rounded-xl bg-surface px-6 py-5">
        <p className="font-serif text-xl leading-snug">
          They hold even if the model behaves unexpectedly. TRAI does not care
          that the agent was an LLM.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {CATEGORIES.map((cat, i) => (
          <section key={cat.title}>
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-serif text-3xl">{cat.title}</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {cat.rules.map((rule) => (
                <li key={rule} className="py-3 text-sm leading-relaxed text-muted">
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">DERIVED OUTCOMES</p>
        <h2 className="mt-3 font-serif text-3xl">Never asked as a question.</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2 lg:grid-cols-5">
          {OUTCOMES.map((o) => (
            <div key={o.name} className="bg-surface p-5">
              <h3 className="font-medium">{o.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{o.body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
