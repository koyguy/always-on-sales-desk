import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import {
  connectByHour,
  funnel,
  kpis,
  objections,
  qualBySource,
} from "@/lib/metrics";
import { formatCompact, formatInr } from "@/lib/utils";

export const Route = createFileRoute("/dashboards")({ component: DashboardsPage });

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-line)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-fg)",
};

function DashboardsPage() {
  return (
    <AppShell>
      <p className="font-mono text-xs tracking-[0.2em] text-muted">AUDIT & ANALYTICS</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">The evidence, and the argument.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Illustrative sample cohort — the dashboards the system is designed to
        emit. A sampled percentage of calls, plus all complaints, opt-outs and
        escalations, are reviewed weekly against a fixed scorecard.
      </p>

      <section className="mt-12">
        <p className="font-mono text-xs tracking-widest text-muted">OPERATIONAL · DAILY</p>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Attempted" value={formatCompact(kpis.attempted)} />
          <Stat label="Connected" value={formatCompact(kpis.connected)} hint={`${Math.round(kpis.connectRate * 100)}%`} />
          <Stat label="Completed" value={formatCompact(kpis.completed)} />
          <Stat label="Containment" value={`${Math.round(kpis.containment * 100)}%`} hint="without a human" />
          <Stat label="Transfer rate" value={`${Math.round(kpis.transfer * 100)}%`} />
          <Stat label="p95 round trip" value={`${kpis.p95}s`} hint="budget 1.2s" />
        </div>

        <div className="mt-px grid gap-px overflow-hidden rounded-xl bg-line lg:grid-cols-2">
          <figure className="bg-surface p-5 sm:p-6">
            <figcaption className="mb-4 text-sm">Connect rate by hour</figcaption>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={connectByHour}>
                  <CartesianGrid stroke="var(--color-line)" vertical={false} />
                  <XAxis dataKey="hour" stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="rate" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </figure>
          <figure className="bg-surface p-5 sm:p-6">
            <figcaption className="mb-4 text-sm">Qualification rate by source</figcaption>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualBySource} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid stroke="var(--color-line)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                  <YAxis type="category" dataKey="source" stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} width={72} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="rate" fill="var(--color-fg)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </figure>
        </div>
      </section>

      <section className="mt-16">
        <p className="font-mono text-xs tracking-widest text-muted">COMMERCIAL · FUNNEL</p>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Qualification rate" value={`${(kpis.qualRate * 100).toFixed(1)}%`} />
          <Stat label="Cost / qualified · AI" value={formatInr(kpis.costAi)} />
          <Stat label="Cost / qualified · human" value={formatInr(kpis.costHuman)} />
          <Stat label="Opt-out rate" value={`${(kpis.optOut * 100).toFixed(1)}%`} hint="brand-safety gate" />
        </div>

        <div className="mt-px grid gap-px overflow-hidden rounded-xl bg-line lg:grid-cols-2">
          <figure className="bg-surface p-5 sm:p-6">
            <figcaption className="mb-6 text-sm">Contacted → disbursal</figcaption>
            <ul className="space-y-4">
              {funnel.map((row, i) => {
                const max = funnel[0].n;
                const prev = i === 0 ? row.n : funnel[i - 1].n;
                const conv = Math.round((row.n / prev) * 100);
                return (
                  <li key={row.stage}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="text-sm">{row.stage}</span>
                      <span className="font-mono text-xs tabular-nums text-muted">
                        {formatCompact(row.n)}
                        {i > 0 ? ` · ${conv}%` : null}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.max(6, (row.n / max) * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </figure>
          <figure className="bg-surface p-5 sm:p-6">
            <figcaption className="mb-4 text-sm">Ranked objections</figcaption>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objections}>
                  <CartesianGrid stroke="var(--color-line)" vertical={false} />
                  <XAxis dataKey="reason" stroke="var(--color-faint)" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                  <YAxis stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="n" fill="var(--color-warn)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </figure>
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-faint">
        Cost per qualified on this page is funnel-level and includes the
        first-touch advantage. Raw ₹ per connected minute — and whether it
        actually beats a human seat — lives on the{" "}
        <Link to="/economics" className="text-fg underline decoration-line underline-offset-4">
          economics page
        </Link>
        . Findings drive versioned configuration changes, each traceable to the
        calls that motivated it via the configuration fingerprint.
      </p>
    </AppShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-surface px-5 py-5">
      <p className="font-mono text-xs text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}
