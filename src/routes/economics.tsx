import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  LINE_LABELS,
  type LineKey,
  type StackId,
  blindSpots,
  coCreateSplit,
  coCreateSteps,
  defaults,
  human,
  model,
  stackTotal,
  stacks,
} from "@/lib/economics";
import { cn, formatCompact, formatInrMoney } from "@/lib/utils";

export const Route = createFileRoute("/economics")({ component: EconomicsPage });

const LINE_ORDER: LineKey[] = ["orch", "tel", "stt", "tts", "llm"];

function EconomicsPage() {
  const [stackId, setStackId] = useState<StackId>("cocreate");
  const [minutes, setMinutes] = useState(defaults.connectedMinutes);
  const [qualPct, setQualPct] = useState(Math.round(defaults.qualRate * 100));
  const [aht, setAht] = useState(defaults.ahtSeconds);
  const [early, setEarly] = useState(true);

  const result = useMemo(
    () =>
      model({
        stackId,
        connectedMinutes: minutes,
        qualRate: qualPct / 100,
        ahtSeconds: aht,
        earlyHangup: early,
      }),
    [stackId, minutes, qualPct, aht, early],
  );

  const maxLine = Math.max(...stacks.flatMap((s) => Object.values(s.lines)));

  return (
    <AppShell>
      <p className="font-mono text-xs tracking-[0.2em] text-muted">
        UNIT ECONOMICS · VERSION 0.3
      </p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
        A human already costs about six rupees a minute. The AI has to beat that
        — or beat time.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        v0.2 treated cost as “four usage-based vendors, falling with volume.”
        That is true only if you never rent the orchestration layer. A managed
        India voice stack currently lands at ₹6–15 per connected minute. A
        loaded tier-2 sales agent is about ₹6.20. The AI does not automatically
        win on rate.
      </p>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">WHAT v0.2 MISSED</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">Four holes in the original draft.</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
          {blindSpots.map((b) => (
            <div key={b.n} className="bg-surface p-6 sm:p-8">
              <p className="font-mono text-xs text-accent">{b.n}</p>
              <h3 className="mt-3 font-serif text-2xl leading-snug">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">THREE STACKS, ONE MINUTE</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">
          The ₹6–15 minute is a vendor tax. Co-create to land inside the human
          rate.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Working midpoints in rupees per connected minute, Q3 2026 published
          and reported ranges — not quotes. The spike re-measures every line
          against Embifi’s own traffic.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs tracking-wider text-muted">
                <th className="py-3 pr-4 font-medium">Line</th>
                {stacks.map((s) => (
                  <th key={s.id} className="py-3 pr-4 font-medium">
                    {s.name}
                    <span className="mt-1 block font-sans text-xs font-normal tracking-normal text-faint">
                      {s.range}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINE_ORDER.map((key) => (
                <tr key={key} className="border-b border-line">
                  <td className="py-3 pr-4">{LINE_LABELS[key]}</td>
                  {stacks.map((s) => (
                    <td key={s.id} className="py-3 pr-4 font-mono text-xs tabular-nums">
                      {formatInrMoney(s.lines[key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-line">
                <td className="py-3 pr-4 font-medium">All-in midpoint</td>
                {stacks.map((s) => (
                  <td key={s.id} className="py-3 pr-4 font-mono text-xs tabular-nums text-accent">
                    {formatInrMoney(stackTotal(s))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted">Human BPO, loaded</td>
                <td colSpan={3} className="py-3 font-mono text-xs tabular-nums text-muted">
                  {formatInrMoney(human.perMinute)} / min · {formatCompact(human.connectedMinutes)}{" "}
                  connected minutes / seat / month
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">WORKING MODEL</p>
        <h2 className="mt-3 font-serif text-3xl">Move the volume. Watch the seat.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Connected minutes are what every vendor bills. Qualification rate and
          handle time turn that into cost per qualified lead — the number that
          belongs next to Embifi’s human baseline.
        </p>

        <div className="mt-8 grid gap-2 sm:grid-cols-3">
          {stacks.map((s) => {
            const active = stackId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStackId(s.id)}
                className={cn(
                  "rounded-xl p-5 text-left transition-colors duration-150",
                  active ? "bg-raised" : "bg-surface hover:bg-raised/60",
                )}
              >
                <p className="font-mono text-xs text-accent">{s.range}</p>
                <h3 className="mt-2 font-serif text-2xl">{s.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{s.tag}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-surface p-6 sm:p-8">
            <SliderRow
              label="Connected minutes / month"
              valueLabel={formatCompact(minutes)}
              min={2000}
              max={80000}
              step={500}
              value={minutes}
              onChange={setMinutes}
            />
            <SliderRow
              label="Qualification rate"
              valueLabel={`${qualPct}%`}
              min={10}
              max={40}
              step={1}
              value={qualPct}
              onChange={setQualPct}
            />
            <SliderRow
              label="Average connected duration"
              valueLabel={`${aht}s`}
              min={45}
              max={180}
              step={5}
              value={aht}
              onChange={setAht}
            />
            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={early}
                onChange={(e) => setEarly(e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-accent"
              />
              <span>
                <span className="block text-sm">Early hangup on voicemail and dead air</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  Co-create only — VAD cuts non-human connects at ~20s. Modelled
                  as an 18% minute reduction. A rented platform bills the pulse
                  whether you hang up or not.
                </span>
              </span>
            </label>
          </div>

          <div className="bg-surface p-6 sm:p-8">
            <p className="font-mono text-xs tracking-widest text-muted">
              {result.stack.name.toUpperCase()} · THIS VOLUME
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-5">
              <Stat label="₹ / connected min" value={formatInrMoney(result.perMin)} />
              <Stat label="Monthly stack" value={formatInrMoney(result.monthly)} />
              <Stat label="Qualified leads" value={formatCompact(result.qualified)} />
              <Stat label="₹ / qualified" value={formatInrMoney(result.perQualified)} />
            </dl>
            <div className="mt-8 border-t border-line pt-5">
              <p className="text-sm">Same volume, human seats</p>
              <p className="mt-1 font-serif text-2xl tabular-nums">
                {formatInrMoney(result.humanMonthly)}
                <span className="ml-2 font-sans text-sm text-muted">
                  · {result.agents.toFixed(1)} agents · {formatInrMoney(result.humanPerQualified)} /
                  qualified
                </span>
              </p>
              <p
                className={cn(
                  "mt-3 text-sm",
                  result.deltaMonthly < 0 ? "text-accent" : "text-warn",
                )}
              >
                {result.deltaMonthly < 0
                  ? `${formatInrMoney(Math.abs(result.deltaMonthly))} cheaper than the seat, before counting nights, Sundays and first-touch speed.`
                  : `${formatInrMoney(result.deltaMonthly)} dearer than the seat on rate alone. The case then rests on speed and coverage, not on the minute.`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-px overflow-hidden rounded-xl bg-line">
          <div className="bg-surface p-6 sm:p-8">
            <p className="mb-5 text-sm">Where this minute goes</p>
            <ul className="space-y-3">
              {LINE_ORDER.map((key) => {
                const v = result.stack.lines[key];
                return (
                  <li key={key}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-sm">{LINE_LABELS[key]}</span>
                      <span className="font-mono text-xs tabular-nums text-muted">
                        {formatInrMoney(v)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.max(4, (v / maxLine) * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-faint">
              {result.stack.notes[0]} {result.stack.notes[1]}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">CO-CREATE THE PIPELINE</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">
          Own the loop. Buy only minutes, speech and compute.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          The ₹1.50–2.50 all-in number circulating in the review assumes
          self-hosted STT and near-free TTS. Sarvam Bulbul will not do that on
          day one. Beat ₹6 first. Treat ₹2 as a later squeeze once TTS is
          barged, cached and — if quality holds — self-hosted.
        </p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {coCreateSteps.map((step) => (
            <li key={step.n} className="rounded-xl bg-surface p-6">
              <p className="font-mono text-xs text-accent">{step.n}</p>
              <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">WHO BRINGS WHAT</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
          <div className="bg-surface p-6 sm:p-8">
            <h3 className="font-serif text-2xl">Embifi</h3>
            <p className="mt-1 text-xs text-muted">Business logic, trunks, data</p>
            <ul className="mt-6 space-y-3">
              {coCreateSplit.embifi.map((item) => (
                <li key={item} className="border-t border-line pt-3 text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface p-6 sm:p-8">
            <h3 className="font-serif text-2xl">Built together</h3>
            <p className="mt-1 text-xs text-muted">The conversation engine — Embifi-owned IP</p>
            <ul className="mt-6 space-y-3">
              {coCreateSplit.together.map((item) => (
                <li key={item} className="border-t border-line pt-3 text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-faint">
        Not in the minute: two to six weeks of engineering to first live call,
        reserved GPU if STT is self-hosted, DLT registration, concurrent-channel
        reservation, and weekly QA sampling. Those are capex and ops. They do
        not scale linearly with minutes — which is the point.
      </p>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
        <p className="font-serif text-2xl">The decision is now three paths, not two.</p>
        <Button asChild>
          <Link to="/decision">
            Open the revised decision
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-serif text-2xl tabular-nums sm:text-3xl">{value}</dd>
    </div>
  );
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="py-4 first:pt-0">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <label className="text-sm">{label}</label>
        <span className="font-mono text-xs tabular-nums text-accent">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="econ-slider h-11 w-full"
        aria-label={label}
      />
    </div>
  );
}
