import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

const PRINCIPLES = [
  {
    n: "01",
    title: "Driven by the lead system, not by a phone number.",
    body: "An orchestration layer decides who is called, in what order, at what hour and how many times, so calling effort tracks lead value instead of list order.",
  },
  {
    n: "02",
    title: "It writes back as it talks.",
    body: "Each confirmed fact updates the CRM record mid-call. The call is a data-capture event that moves an application forward, not a recording someone reads later.",
  },
  {
    n: "03",
    title: "It is auditable end to end.",
    body: "Recording, transcript, structured outcome, consent marker and the exact configuration that produced the behaviour are retained and queryable, with analytics on top.",
  },
  {
    n: "04",
    title: "It is fenced.",
    body: "Calling windows, attempt caps, instant opt-out, AI disclosure and a hard boundary on what the agent may promise — so scale never comes at the cost of the brand or of compliance.",
  },
];

const TODAY = [
  {
    what: "Every lead gets equal human effort",
    why: "Agent hours are spent on unreachable, uninterested and ineligible leads before a serious borrower is reached.",
  },
  {
    what: "Slow first contact",
    why: "A borrower comparing options converts with whoever calls first. Intent decays within hours.",
  },
  {
    what: "The same script, every call",
    why: "Plans, pricing, eligibility and documents are explained near-identically — the fastest route to agent fatigue.",
  },
  {
    what: "Manual note-taking",
    why: "Captured information is inconsistent. The next agent to touch the lead starts from close to zero.",
  },
  {
    what: "Fixed capacity, variable demand",
    why: "Campaign spikes overflow the queue, and a missed inbound call is a paid-for lead lost outright.",
  },
  {
    what: "No systematic call QA",
    why: "What was said or promised cannot be verified after the fact — an avoidable exposure in regulated lending.",
  },
];

const STEPS = [
  "The lead lands — ad form, partner feed, website, referral or inbound missed call — with source, product and consent.",
  "The orchestrator selects it. Priority, consent, DND, window, attempt history and queue depth decide whether it is dialled now.",
  "The agent is briefed from the record: name, language, product, prior attempts, fields already captured.",
  "The conversation runs: greeting and AI disclosure, qualification, FAQ, a concrete commitment.",
  "Facts are written as they are confirmed, field by field, during the call.",
  "An outcome is derived — qualified, partial, not now, not eligible or do-not-contact — never asked as a question.",
  "The next action fires: WhatsApp link, human task, callback, nurture, or permanent suppression.",
  "Everything is filed. Recording, transcript, structured outcome and the event log land in the audit store.",
];

function Home() {
  return (
    <AppShell>
      <article>
        <section className="stagger-in">
          <p className="font-mono text-xs tracking-[0.22em] text-muted">
            PREPARED FOR EMBIFI · VERSION 0.3 · SUPERSEDES 0.2
          </p>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Always-On
            <br />
            Sales Desk
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            A voice AI sales agent for Embifi's lending funnel — qualifying,
            capturing and converting every lead, inbound and outbound.
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-faint">
            Draft for architecture and business review. Product-configured rather
            than product-specific: rider plans, two-wheeler and EV finance,
            personal loans and future products share one pipeline. v0.3 adds
            TRAI reality, unit economics against a human seat, and a co-create
            path that can actually beat ₹6 a minute.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/floor">
                Walk the floor
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/economics">Unit economics</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/decision">Three paths</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="bg-surface p-6 sm:p-8">
                <p className="font-mono text-xs text-accent">{p.n}</p>
                <h2 className="mt-3 font-serif text-2xl leading-snug">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-surface px-6 py-8 shadow-[var(--shadow-border)] sm:px-10">
          <p className="font-mono text-xs tracking-[0.2em] text-muted">v0.3 ADDENDUM</p>
          <p className="mt-4 max-w-3xl font-serif text-2xl leading-snug sm:text-3xl">
            The architecture held. The costing did not. A managed voice stack
            at ₹6–15 a minute loses to a ₹6.20 human seat on rate alone.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            Four holes: TRAI/DLT is not a plug-in; barge-in that keys off volume
            stalls on Indian streets; fifty simultaneous dials are paid trunks,
            not a scheduler flag; and the only path that lands inside the human
            rate is co-creating Plane 3 on LiveKit or Pipecat with local SIP.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/economics">
                Open the working model
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/architecture">Architecture</Link>
            </Button>
          </div>
        </section>

        <section className="mt-8 border-t border-line pt-16">
          <p className="font-mono text-xs tracking-[0.2em] text-muted">EXECUTIVE SUMMARY</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 text-base leading-relaxed text-muted">
              <p>
                Embifi's revenue is a function of how many borrowers it can
                qualify and convert. Its cost is a function of how many phone
                calls a human has to make to get there. This proposal decouples
                the two.
              </p>
              <p>
                Today every lead — bought through advertising, supplied by a
                partner, or arriving on the inbound number — is worked manually,
                regardless of whether that lead is serious, reachable or
                eligible. Agent time, not lead supply, is the ceiling on growth,
                and it is the largest controllable line in customer acquisition
                cost.
              </p>
              <p>
                The agent places and answers calls directly, holds the same
                qualification conversation in natural code-switched Hindi-English,
                writes what it learns into the system of record while the call is
                still live, and escalates to a human only when the lead has
                earned that attention or asks for it.
              </p>
            </div>
            <aside className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
              <p className="font-mono text-xs tracking-widest text-muted">DESIGN PRINCIPLE</p>
              <p className="mt-4 font-serif text-2xl leading-snug">
                When a human picks up the phone, they are talking to someone
                already known to be interested, reachable and broadly eligible.
              </p>
              <p className="mt-4 text-sm text-muted">
                Basic facts already captured and visible on screen. Humans are
                not removed from the funnel — they are reserved for it.
              </p>
            </aside>
          </div>
        </section>

        <section className="mt-20 border-t border-line pt-16">
          <p className="font-mono text-xs tracking-[0.2em] text-muted">WHAT HAPPENS TODAY</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl sm:text-4xl">
            Acquisition spend is already committed. The second cost scales
            linearly — and can be re-engineered.
          </h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {TODAY.map((row) => (
              <div key={row.what} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] sm:gap-8">
                <p className="text-sm font-medium">{row.what}</p>
                <p className="text-sm leading-relaxed text-muted">{row.why}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <p className="font-mono text-xs tracking-[0.2em] text-muted">HOW IT WORKS</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Eight steps, one pipeline.</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-lg bg-surface p-5">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-relaxed text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 rounded-xl bg-surface px-6 py-10 shadow-[var(--shadow-border)] sm:px-10">
          <p className="font-mono text-xs tracking-[0.2em] text-muted">OUT OF SCOPE · VERSION 1</p>
          <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <li>Credit decisioning and underwriting</li>
            <li>KYC and document verification (stay in the app flow)</li>
            <li>Collections and repayment calling</li>
            <li>Dialling numbers without a consent basis</li>
          </ul>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            Sensitive identifiers never enter the call. Aadhaar, PAN, bank
            account, card details and OTPs flow only through the authenticated
            app journey. If a customer volunteers such a value, it is redacted
            before storage. This is a fixed design decision.
          </p>
        </section>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
          <p className="font-serif text-2xl">The floor is the argument, running.</p>
          <Button asChild>
            <Link to="/floor">
              Open the live floor
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </article>
    </AppShell>
  );
}
