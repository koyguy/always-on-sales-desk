import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { latencyBudget, planes, schemaFields } from "@/lib/metrics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/architecture")({ component: ArchitecturePage });

function ArchitecturePage() {
  const [active, setActive] = useState(planes[2].id);
  const plane = planes.find((p) => p.id === active) ?? planes[0];

  return (
    <AppShell>
      <p className="font-mono text-xs tracking-[0.2em] text-muted">SYSTEM ARCHITECTURE</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
        Four sequential planes. Two that run across all of them.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        Each plane has one job, one owner and one clear interface to the next. The
        vendor boundary is one plane wide — conversation — so a later move is a
        component swap, not a rewrite. v0.3 is explicit: that plane is
        co-created, or it is a TRAI-native Indian platform. It is never
        Twilio-through-US.
      </p>

      <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2 lg:grid-cols-4">
        {planes.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p.id)}
            className={cn(
              "bg-surface p-5 text-left transition-colors duration-150",
              active === p.id ? "bg-raised" : "hover:bg-raised/60",
            )}
          >
            <p className="flex items-center justify-between font-mono text-xs text-accent">
              {p.n}
              {p.vendor ? <span className="text-warn">the edge</span> : <span className="text-faint">{p.owner}</span>}
            </p>
            <h2 className="mt-3 font-serif text-2xl">{p.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.job}</p>
          </button>
        ))}
      </div>

      <div className="mt-px grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
        <div className="bg-surface p-6">
          <p className="font-mono text-xs tracking-widest text-muted">GUARDRAIL PLANE — ACROSS ALL FOUR</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Contact discipline, disclosure, permitted-statement boundaries, opt-out
            handling, escalation triggers, sensitive-data rules. Enforced outside
            the language model, so they hold even if the model behaves unexpectedly.
          </p>
        </div>
        <div className="bg-surface p-6">
          <p className="font-mono text-xs tracking-widest text-muted">AUDIT & ANALYTICS PLANE — ACROSS ALL FOUR</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Recording and transcript store, immutable event log, configuration
            fingerprint, QA sampling, operational and funnel dashboards.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl">
            {plane.n} · {plane.name}
          </h3>
          <p className="font-mono text-xs text-muted">Owner: {plane.owner}</p>
        </div>
        {plane.vendor ? (
          <p className="mt-4 rounded-md bg-inset px-4 py-3 text-sm text-warn">
            Plane 3 is the only place a third-party voice platform could sit —
            and the only plane whose rented minute currently loses to a human
            seat. Planes 1, 2 and 4 and both cross-cutting planes stay with
            Embifi in every scenario.
          </p>
        ) : null}
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{plane.notes}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {plane.components.map((c) => (
            <li key={c} className="border-t border-line pt-2 text-sm">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">LATENCY BUDGET</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">
          A delay much beyond a second reads immediately as a machine.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          The sub-1.2 second round trip holds only if every stage streams partial
          results instead of waiting for a complete input.
        </p>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {latencyBudget.map((row) => (
            <div key={row.stage} className="grid gap-1 py-4 sm:grid-cols-[1.2fr_0.6fr_1.2fr]">
              <p className="text-sm">{row.stage}</p>
              <p className="font-mono text-sm text-accent">{row.target}</p>
              <p className="text-sm text-muted">{row.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-faint">
          Where a mid-call CRM lookup or write is unavoidable, it runs
          asynchronously behind a natural acknowledgement rather than blocking
          the response. Transport must terminate in-region: a US CPaaS hop is
          enough on its own to miss 1.2 seconds.
        </p>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-[0.2em] text-muted">CORE CAPTURED RECORD</p>
        <h2 className="mt-3 font-serif text-3xl">Products extend this with their own fields.</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs tracking-wider text-muted">
                <th className="py-3 pr-4 font-medium">Field</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {schemaFields.map((row) => (
                <tr key={row.field} className="border-b border-line align-top">
                  <td className="py-3 pr-4 font-mono text-xs">{row.field}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted">{row.type}</td>
                  <td className="py-3 text-muted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
