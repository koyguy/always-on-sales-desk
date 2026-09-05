import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, PhoneForwarded } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { emptyRecord, queueLeads, scenarios, scenarioByLeadId } from "@/lib/scenarios";
import type { AuditEvent, CapturedRecord, Scenario, Turn } from "@/lib/types";
import { cn, formatInr } from "@/lib/utils";

export const Route = createFileRoute("/floor")({ component: FloorPage });

const FIELD_ROWS: { key: keyof CapturedRecord; label: string }[] = [
  { key: "contact_verified", label: "contact_verified" },
  { key: "product_interest", label: "product_interest" },
  { key: "amount_sought", label: "amount_sought" },
  { key: "work_type", label: "work_type" },
  { key: "income_band", label: "income_band" },
  { key: "location_preference", label: "location_preference" },
  { key: "document_readiness", label: "document_readiness" },
  { key: "commitment", label: "commitment" },
  { key: "objections", label: "objections" },
  { key: "qualification_status", label: "qualification_status" },
  { key: "next_action", label: "next_action" },
  { key: "consent_captured", label: "consent_captured" },
];

function formatField(key: keyof CapturedRecord, record: CapturedRecord): string {
  const v = record[key];
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return formatInr(v);
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") return `${v.type} · ${v.when}`;
  return String(v);
}

function newCallId() {
  return `CA-${Math.floor(100000 + Math.random() * 900000)}`;
}

const INITIAL_CALL_ID = "CA-184021";

function FloorPage() {
  const [scenario, setScenario] = useState<Scenario>(scenarios[0]);
  const [callId, setCallId] = useState(INITIAL_CALL_ID);
  const [turnIndex, setTurnIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.5);
  const [status, setStatus] = useState<"idle" | "dialing" | "live" | "done">("idle");
  const [record, setRecord] = useState<CapturedRecord>(() =>
    emptyRecord(scenarios[0].lead, INITIAL_CALL_ID),
  );
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [elapsed, setElapsed] = useState(0);

  const load = (next: Scenario) => {
    const id = newCallId();
    setScenario(next);
    setCallId(id);
    setTurnIndex(0);
    setPlaying(true);
    setStatus("idle");
    setRecord(emptyRecord(next.lead, id));
    setTranscript([]);
    setEvents([]);
    setFlash(new Set());
    setElapsed(0);
  };

  const applyTurn = (turn: Turn) => {
    setTranscript((prev) => [...prev, turn]);
    if (turn.write) {
      const keys = Object.keys(turn.write);
      setRecord((prev) => ({ ...prev, ...turn.write }));
      setFlash(new Set(keys));
    }
    if (turn.meta === "connect" || turn.meta === "disclosure") setStatus("live");
    if (turn.meta === "dnd-check" || turn.meta === "dial") setStatus("dialing");
    if (turn.meta === "outcome") {
      setStatus("done");
      setPlaying(false);
    }
    setEvents((prev) => [
      ...prev,
      {
        t: Date.now(),
        kind: turn.meta ?? (turn.speaker === "system" ? "system" : "utterance"),
        detail:
          turn.meta === "outcome"
            ? `${turn.write?.qualification_status} → ${turn.write?.next_action}`
            : turn.meta === "disclosure"
              ? "AI disclosure delivered"
              : turn.meta === "opt-out"
                ? "Opt-out honoured"
                : turn.meta === "barge-in"
                  ? "Barge-in — agent stopped"
                  : turn.speaker === "system"
                    ? turn.text
                    : `${turn.speaker} turn`,
      },
    ]);
  };

  useEffect(() => {
    if (!playing) return;
    if (turnIndex >= scenario.turns.length) {
      setStatus("done");
      setPlaying(false);
      return;
    }
    const turn = scenario.turns[turnIndex];
    const t = window.setTimeout(() => {
      applyTurn(turn);
      setTurnIndex((i) => i + 1);
    }, Math.max(280, turn.ms / speed));
    return () => window.clearTimeout(t);
  }, [playing, turnIndex, scenario, speed]);

  useEffect(() => {
    if (!playing && status !== "live" && status !== "dialing") return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000 / speed);
    return () => window.clearInterval(t);
  }, [playing, status, speed]);

  const escalate = () => {
    if (status === "done") return;
    setPlaying(false);
    const customer: Turn = {
      speaker: "customer",
      text: "Mujhe insaan se baat karni hai.",
      ms: 0,
      meta: "transfer",
    };
    const agent: Turn = {
      speaker: "agent",
      text: "Zaroor. Transfer karti hoon — koi deflection nahi. Ek human agent ab aapke record ke saath pick karega.",
      ms: 0,
      write: {
        qualification_status: "partial",
        next_action: "human_callback",
      },
      meta: "outcome",
    };
    applyTurn(customer);
    applyTurn(agent);
    setStatus("done");
  };

  const lastSpeaker = transcript.filter((t) => t.speaker !== "system").at(-1)?.speaker;
  const speaking = status === "live" && playing && lastSpeaker === "agent";
  const outcome = record.qualification_status;
  const actionCopy =
    record.next_action === "whatsapp_link"
      ? "WhatsApp app link dispatched. Calling stops for this lead."
      : record.next_action === "nurture"
        ? "Parked on nurture. Saturday 10:00 callback scheduled. Attempt cap honoured."
        : record.next_action === "suppress"
          ? "Number suppressed across all campaigns. Honoured within seconds."
          : record.next_action === "human_callback"
            ? "Warm task created. Human agent receives the live record."
            : null;

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const prefilled = useMemo(() => new Set(Object.keys(scenario.lead.formFields)), [scenario]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [transcript]);

  return (
    <AppShell flush>
      <div className="flex min-h-0 flex-col bg-line lg:h-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-xs">
              <span className={cn("size-1.5 rounded-full bg-accent", status === "live" && "live-dot")} />
              {status === "live" ? "LIVE" : status === "dialing" ? "DIALLING" : status === "done" ? "FILED" : "STANDBY"}
            </span>
            <span className="hidden text-faint sm:inline">·</span>
            <span className="font-mono text-xs text-muted">Simulated 11:24 IST · window 09:00–19:00 · no live PSTN</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => load(s)}
                className={cn(
                  "h-8 rounded-full px-3 font-mono text-xs",
                  s.id === scenario.id ? "bg-primary text-primary-fg" : "bg-raised text-muted hover:text-fg",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-px lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="hidden flex-col overflow-hidden bg-bg lg:flex">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-mono text-xs tracking-widest text-muted">QUEUE</p>
              <span className="font-mono text-xs text-faint">priority</span>
            </div>
            <ul className="min-h-0 flex-1 overflow-auto">
              {queueLeads.map((lead) => {
                const active = lead.id === scenario.lead.id;
                const blocked = lead.dnd;
                const hasScript = scenarios.some((s) => s.lead.id === lead.id);
                return (
                  <li key={lead.id}>
                    <button
                      type="button"
                      disabled={blocked}
                      onClick={() => hasScript && load(scenarioByLeadId(lead.id))}
                      className={cn(
                        "flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition-colors duration-150",
                        active ? "bg-raised" : "hover:bg-surface",
                        blocked && "opacity-40",
                      )}
                    >
                      <span>
                        <span className="block text-sm">{lead.name}</span>
                        <span className="mt-0.5 block font-mono text-xs text-muted">
                          {lead.product} · {lead.source}
                        </span>
                        {blocked ? (
                          <span className="mt-1 block font-mono text-xs text-danger">DND · not dialled</span>
                        ) : null}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-faint">{lead.priority}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="flex min-h-[28rem] flex-col bg-bg lg:min-h-0">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{scenario.lead.name}</p>
                <p className="font-mono text-xs text-muted">
                  {scenario.lead.phoneMasked} · {scenario.lead.city} · {scenario.lead.language}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Waveform active={speaking} />
                <span className="font-mono text-xs tabular-nums text-muted">
                  {mm}:{ss}
                </span>
              </div>
            </div>

            <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-auto px-4 py-4">
              {transcript.length === 0 ? (
                <p className="text-sm text-faint">Waiting for the orchestrator…</p>
              ) : null}
              {transcript.map((turn, i) => (
                <TurnBubble key={`${i}-${turn.text.slice(0, 12)}`} turn={turn} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
              <Button
                size="sm"
                variant="subtle"
                onClick={() => setPlaying((p) => !p)}
                disabled={status === "done"}
              >
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {playing ? "Pause" : "Play"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => load(scenario)}>
                <RotateCcw className="size-3.5" />
                Restart
              </Button>
              <Button size="sm" variant="ghost" onClick={escalate} disabled={status === "done" || status === "idle"}>
                <PhoneForwarded className="size-3.5" />
                Ask for a human
              </Button>
              <div className="ml-auto flex items-center gap-1">
                {[1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "h-8 min-w-10 rounded-sm px-2 font-mono text-xs",
                      speed === s ? "bg-raised text-fg" : "text-muted",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col bg-bg">
            <div className="border-b border-line px-4 py-3">
              <p className="font-mono text-xs tracking-widest text-muted">RECORD</p>
              <p className="mt-1 font-mono text-xs text-faint">
                {record.lead_id} · {record.call_id}
              </p>
            </div>
            <ul className="min-h-0 flex-1 overflow-auto px-2 py-2">
              {FIELD_ROWS.map((row) => {
                const value = formatField(row.key, record);
                const empty = value === "—";
                const flashing = flash.has(row.key);
                return (
                  <li
                    key={row.key}
                    className={cn("rounded-md px-2 py-2", flashing && "field-flash")}
                  >
                    <p className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-faint">{row.label}</span>
                      {prefilled.has(row.key) && empty ? (
                        <span className="font-mono text-xs text-muted">from form</span>
                      ) : null}
                    </p>
                    <p className={cn("mt-0.5 text-sm", empty ? "text-faint" : "text-fg")}>
                      {prefilled.has(row.key) && empty
                        ? String(scenario.lead.formFields[row.key as keyof CapturedRecord] ?? "—")
                        : value}
                    </p>
                  </li>
                );
              })}
            </ul>
            {outcome ? (
              <div className="border-t border-line px-4 py-4">
                <Badge
                  tone={
                    outcome === "qualified"
                      ? "live"
                      : outcome === "do_not_contact"
                        ? "danger"
                        : outcome === "partial"
                          ? "warn"
                          : "muted"
                  }
                >
                  {outcome}
                </Badge>
                {actionCopy ? <p className="mt-2 text-sm leading-relaxed text-muted">{actionCopy}</p> : null}
              </div>
            ) : null}
            <div className="max-h-32 overflow-auto border-t border-line px-4 py-3">
              <p className="mb-2 font-mono text-xs tracking-widest text-muted">EVENT LOG</p>
              <ul className="space-y-1">
                {events.slice(-8).map((e, i) => (
                  <li key={`${e.t}-${i}`} className="font-mono text-xs text-faint">
                    {e.kind} · {e.detail}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function TurnBubble({ turn }: { turn: Turn }) {
  if (turn.speaker === "system") {
    return (
      <p className="font-mono text-xs text-faint">
        {turn.meta ? `${turn.meta} · ` : null}
        {turn.text}
      </p>
    );
  }
  const agent = turn.speaker === "agent";
  return (
    <div className={cn("flex", agent ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[min(42rem,92%)] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
          agent ? "rounded-tl-sm bg-surface text-fg" : "rounded-tr-sm bg-raised text-fg",
        )}
      >
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">
          {agent ? "Ananya · agent" : "Customer"}
          {turn.meta === "barge-in" ? " · barge-in" : null}
          {turn.meta === "opt-out" ? " · opt-out" : null}
          {turn.meta === "transfer" ? " · human requested" : null}
        </p>
        {turn.text}
      </div>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-8 items-center gap-px" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className={cn("wave-bar", !active && "is-idle")}
          style={{
            height: `${8 + ((i * 3) % 14)}px`,
            animationDelay: `${(i % 6) * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}
