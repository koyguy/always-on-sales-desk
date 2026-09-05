import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { scorecard, vendorQuestions } from "@/lib/economics";

export const Route = createFileRoute("/decision")({ component: DecisionPage });

const PATHS = [
  {
    id: "buy",
    name: "Buy the plane",
    tag: "Pilot only",
    cost: "₹6–12 / min",
    time: "Weeks to first live call",
    body: "A TRAI-native Indian voice platform (Bolna-class) on Exotel, with Embifi’s own Sarvam and Gemini keys. Fastest way onto the floor. The orchestration minute never falls below a few rupees, so it does not beat a human seat on rate.",
  },
  {
    id: "assemble",
    name: "Assemble vendors",
    tag: "Do not",
    cost: "₹10–18 / min",
    time: "Weeks, then a rewrite",
    body: "Vapi or Retell plus Twilio plus a Western TTS. This is the vendor-tax stack. Dearer than a BPO agent, slower into Indian mobiles, and a filtering risk. Disqualified for production; useful only as the control in the spike.",
  },
  {
    id: "cocreate",
    name: "Co-create",
    tag: "Production path",
    cost: "₹3–6 / min",
    time: "Two to six weeks to first call, then it is ours",
    body: "LiveKit Agents or Pipecat on Embifi’s cloud, local SIP, Sarvam speech, Gemini Flash. Embifi owns the IP. The minute lands inside the human rate. A later swap of STT or TTS is a worker change, not a vendor divorce.",
  },
];

const ROWS = [
  {
    consider: "Time to first pilot",
    buy: "Fastest. The pipeline exists.",
    assemble: "Fast to demo, slow to comply.",
    cocreate: "Slower. Every layer is our integration work.",
  },
  {
    consider: "Hinglish accuracy",
    buy: "Often a core strength — still measured on Embifi audio.",
    assemble: "Western STT is the risk. Do not assume from a US demo.",
    cocreate: "Sarvam / Indic models, ours to validate and tune.",
  },
  {
    consider: "TRAI routing",
    buy: "Must be native Exotel / Tata / Ozonetel, or it is out.",
    assemble: "Twilio hairpin. Out of policy.",
    cocreate: "Direct SIP. DND scrub sits in our pre-dial path.",
  },
  {
    consider: "Mid-call write-back",
    buy: "The decisive test. Cannot call our API → disqualified.",
    assemble: "Usually possible. Confirm, do not assume.",
    cocreate: "Native — the write-back is our own code.",
  },
  {
    consider: "Noise-robust barge-in",
    buy: "Prove it on street-noise mobile recordings.",
    assemble: "Amplitude VAD will stall. Prove or walk.",
    cocreate: "Silero (or equivalent) tuned on Embifi’s own audio.",
  },
  {
    consider: "₹ / connected minute",
    buy: "₹6–12. Ties or loses to a human seat.",
    assemble: "₹10–18. Loses on rate, loses on routing.",
    cocreate: "₹3–6. The only path that beats the seat.",
  },
  {
    consider: "Lock-in and exit",
    buy: "Moderate, if logic and data stay outside.",
    assemble: "High. Four vendors, one of them the audio path.",
    cocreate: "Low. Each component is independently replaceable.",
  },
  {
    consider: "Who owns the IP",
    buy: "Vendor owns the plane. We own the rest.",
    assemble: "Nobody owns the whole loop.",
    cocreate: "Embifi. The pipeline is the product.",
  },
];

function DecisionPage() {
  return (
    <AppShell>
      <p className="font-mono text-xs tracking-[0.2em] text-muted">BUILD VERSUS BUY · REVISED</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
        Three ways to carry the audio. Only one beats the BPO on cost.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        v0.2 said: buy Plane 3 if it clears the bars. The spike stays. The
        production recommendation does not. Buying the conversation plane at
        ₹6–15 a minute loses the cost argument that justified the project.
      </p>

      <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line lg:grid-cols-3">
        {PATHS.map((p) => (
          <div key={p.id} className="bg-surface p-6 sm:p-8">
            <p className="font-mono text-xs text-accent">{p.tag}</p>
            <h2 className="mt-3 font-serif text-2xl">{p.name}</h2>
            <p className="mt-2 font-mono text-xs text-muted">
              {p.cost} · {p.time}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-xs tracking-wider text-muted">
              <th className="py-3 pr-4 font-medium">Consideration</th>
              <th className="py-3 pr-4 font-medium">Buy the plane</th>
              <th className="py-3 pr-4 font-medium">Assemble vendors</th>
              <th className="py-3 font-medium">Co-create</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.consider} className="border-b border-line align-top">
                <td className="py-4 pr-4 font-medium">{row.consider}</td>
                <td className="py-4 pr-4 text-muted">{row.buy}</td>
                <td className="py-4 pr-4 text-muted">{row.assemble}</td>
                <td className="py-4 text-muted">{row.cocreate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">DECISION METHOD</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">
          One validation spike. Two binary gates. Then a score.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          The same qualification script and the same real recorded Hindi-English
          calls run against the co-create pipeline, a TRAI-native Indian
          platform, and the global assembled stack as a control. Mid-call API
          and TRAI-native SIP are gates, not weights — fail either and the
          candidate is out.
        </p>
        <ul className="mt-8 space-y-4">
          {scorecard.map((s) => (
            <li key={s.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm">
                  {s.label}
                  {s.gate ? (
                    <span className="ml-2 font-mono text-xs text-warn">gate</span>
                  ) : null}
                </span>
                <span className="font-mono text-xs text-muted">{s.gate ? "pass / fail" : `${s.w}%`}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                <div
                  className={s.gate ? "h-full rounded-full bg-warn" : "h-full rounded-full bg-fg"}
                  style={{ width: s.gate ? "100%" : `${s.w * 2.8}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">ASK THEM THIS</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">Five questions the spike has to survive.</h2>
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {vendorQuestions.map((item, i) => (
            <li key={item.q} className="grid gap-3 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-sm leading-relaxed">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.why}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-xl bg-surface p-6 sm:p-10">
        <p className="font-mono text-xs tracking-widest text-muted">
          WORKING RECOMMENDATION · SUBJECT TO THE SPIKE
        </p>
        <p className="mt-5 max-w-3xl font-serif text-2xl leading-snug sm:text-3xl">
          Co-create the conversation plane. Rent a TRAI-native platform only as
          a time-boxed pilot. Never assemble the global stack for production.
        </p>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
          A two-to-six-week co-create puts a live Hinglish agent on Exotel with
          Embifi-owned IP, mid-call write-back, and a minute that can land
          inside the human seat. A Bolna-class pilot is the hedge if that
          calendar slips — not the destination. Because the vendor boundary is
          still one plane wide, the pilot is a component, not a commitment. The
          decision is recorded in writing before either build begins.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/economics">
            Open the working model
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/floor">See it on the floor</Link>
        </Button>
      </div>
    </AppShell>
  );
}
