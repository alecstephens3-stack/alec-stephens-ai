"use client";

import "./tools-b.css";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ToolFrame } from "@/components/desk/tool-frame";
import { cn } from "@/lib/utils";

/**
 * Tomorrow's confirmations. A sample: the schedule and the names are made up,
 * the send is real state in the browser, and nothing leaves the page.
 * From the Tri-Valley discovery call (2026-09-22): the front desk phones every
 * patient the day before; the owner wants texts, with email for the few who
 * ask; and reminders are already bundled cheaply into practice software, so in
 * her words this is something to "put on the side as a bonus."
 */

type Channel = "text" | "email" | "call";
type Status = "queued" | "sent" | "confirmed" | "noreply" | "call";

type Patient = {
  id: number;
  time: string;
  name: string;
  procedure: string;
  channel: Channel;
  /** what the sample patient does once the reminder lands */
  reply: "confirm" | "none";
};

const CLINIC = "Maple Street Dental";

const SCHEDULE: Patient[] = [
  { id: 1, time: "8:00", name: "Dana Whitfield", procedure: "Hygiene visit and exam", channel: "text", reply: "confirm" },
  { id: 2, time: "8:00", name: "Marcus Oyelaran", procedure: "Crown seat, tooth 19", channel: "text", reply: "confirm" },
  { id: 3, time: "8:40", name: "Priya Raman", procedure: "Two fillings, upper left", channel: "email", reply: "confirm" },
  { id: 4, time: "9:20", name: "Tom Halvorsen", procedure: "New patient exam and X-rays", channel: "text", reply: "confirm" },
  { id: 5, time: "10:00", name: "Elena Castellanos", procedure: "Hygiene visit", channel: "text", reply: "none" },
  { id: 6, time: "10:00", name: "Walt Brennan", procedure: "Crown prep, tooth 3", channel: "call", reply: "none" },
  { id: 7, time: "10:40", name: "Jae-won Seo", procedure: "Night guard fitting", channel: "text", reply: "confirm" },
  { id: 8, time: "11:20", name: "Rosa Delgado", procedure: "Hygiene visit and exam", channel: "text", reply: "confirm" },
  { id: 9, time: "12:00", name: "Ken Abernathy", procedure: "Extraction consult", channel: "email", reply: "none" },
  { id: 10, time: "12:30", name: "Lucy Tran", procedure: "Filling, lower right", channel: "text", reply: "confirm" },
  { id: 11, time: "2:00", name: "Harold Pike", procedure: "Denture adjustment", channel: "text", reply: "confirm" },
  { id: 12, time: "2:00", name: "Amara Okafor", procedure: "Hygiene visit", channel: "text", reply: "confirm" },
  { id: 13, time: "2:40", name: "Ben Sato", procedure: "Whitening, second visit", channel: "text", reply: "none" },
  { id: 14, time: "3:20", name: "Grace Lindqvist", procedure: "Crown seat, tooth 30", channel: "text", reply: "confirm" },
  { id: 15, time: "4:00", name: "Omar Haddad", procedure: "Hygiene visit and exam", channel: "text", reply: "confirm" },
];

/** The first afternoon slot; the lunch divider goes above it. */
const FIRST_AFTERNOON_ID = 11;

const DEFAULT_MESSAGE =
  `Hi {first name}, this is ${CLINIC}. We have you down for {date} at {time}. ` +
  `Reply C to confirm or R to reschedule. See you then!`;

const CHANNEL_LABEL: Record<Channel, string> = {
  text: "Text",
  email: "Email only",
  call: "Call only, no cell",
};

const STATUS_LABEL: Record<Status, string> = {
  queued: "Queued",
  sent: "Sent",
  confirmed: "Confirmed",
  noreply: "No reply",
  call: "Needs a call",
};

function withMeridiem(time: string) {
  const hour = Number(time.split(":")[0]);
  return `${time} ${hour >= 8 && hour < 12 ? "AM" : "PM"}`;
}

/** The next day the practice is open (Monday to Thursday), as a label. */
let openDayCache: string | null = null;
function getOpenDay() {
  if (openDayCache === null) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    openDayCache = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  return openDayCache;
}
const subscribeNever = () => () => {};

function fillMessage(template: string, p: Patient, day: string) {
  return template
    .replaceAll("{first name}", p.name.split(" ")[0])
    .replaceAll("{date}", day || "tomorrow")
    .replaceAll("{time}", withMeridiem(p.time));
}

const initialStatus = (): Record<number, Status> =>
  Object.fromEntries(SCHEDULE.map((p) => [p.id, "queued"])) as Record<number, Status>;

export function RemindersTool({ demo = false }: { demo?: boolean } = {}) {
  const day = useSyncExternalStore(subscribeNever, getOpenDay, () => "");
  const [status, setStatus] = useState<Record<number, Status>>(initialStatus);
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [editing, setEditing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const setOne = (id: number, s: Status) => setStatus((prev) => ({ ...prev, [id]: s }));

  const send = () => {
    if (phase !== "idle") return;
    setPhase("sending");
    setEditing(false);
    // Out they go, one every 130ms, about two seconds for the day.
    SCHEDULE.forEach((p, i) => {
      later(140 + i * 130, () => setOne(p.id, p.channel === "call" ? "call" : "sent"));
    });
    const sentAt = 140 + SCHEDULE.length * 130;
    later(sentAt, () => setPhase("sent"));
    // Then the replies trickle in.
    const repliers = SCHEDULE.filter((p) => p.channel !== "call" && p.reply === "confirm");
    repliers.forEach((p, i) => {
      later(sentAt + 700 + i * 320, () => setOne(p.id, "confirmed"));
    });
    const quiet = SCHEDULE.filter((p) => p.channel !== "call" && p.reply === "none");
    quiet.forEach((p, i) => {
      later(sentAt + 700 + repliers.length * 320 + 500 + i * 220, () => setOne(p.id, "noreply"));
    });
  };

  // The self-running tour presses Send on its own, a beat after the window opens.
  useEffect(() => {
    if (!demo) return;
    const t = window.setTimeout(() => send(), 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setStatus(initialStatus());
    setPhase("idle");
  };

  const counts = {
    text: SCHEDULE.filter((p) => p.channel === "text").length,
    email: SCHEDULE.filter((p) => p.channel === "email").length,
    call: SCHEDULE.filter((p) => p.channel === "call").length,
  };
  const confirmed = Object.values(status).filter((s) => s === "confirmed").length;
  const noReply = Object.values(status).filter((s) => s === "noreply").length;
  const texted = SCHEDULE.filter((p) => p.channel === "text" && status[p.id] !== "queued").length;
  const emailed = SCHEDULE.filter((p) => p.channel === "email" && status[p.id] !== "queued").length;
  const toCall = SCHEDULE.filter((p) => status[p.id] === "call").length;

  const preview = fillMessage(message, SCHEDULE[0], day);

  return (
    <ToolFrame
      label="Reminders"
      title="Tomorrow's patients, confirmed without the phone"
      note={
        "Today the front desk rings every patient the day before. This sends the same reminder as a text, or an email for the few who ask, and reads the replies back. One dentist we talked to was straight with us: her practice software already bundles reminders cheaply, so this is something to put \"on the side as a bonus,\" not where the money is."
      }
      status="sample"
      footer={
        <p className="dtb-fine">
          A sample day with made-up names. The send and the replies are real state in your browser; no message leaves this page.
        </p>
      }
    >
      <div className="dtb-stack">
        <div className="dtb-meta">
          <span>
            <b>{day || "Tomorrow"}</b>
          </span>
          <span>
            <b>{SCHEDULE.length} patients</b>, one dentist, two chairs
          </span>
          <span>8 to 5, lunch 1 to 2</span>
        </div>

        <div className="dtb-bubble-wrap">
          <span className="dtb-k">{editing ? "Your message" : "The text, as Dana will read it"}</span>
          {editing ? (
            <>
              <textarea
                className="dtb-bubble"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Reminder message"
                spellCheck
              />
              <span className="dtb-fine">{"{first name}, {date} and {time} fill in for each patient."}</span>
            </>
          ) : (
            <p className="dtb-bubble">{preview}</p>
          )}
        </div>

        <div className="dtb-actions">
          {phase === "sent" ? (
            <button type="button" className="sai-btn ghost dtb-btn" onClick={reset}>
              Start the day again
            </button>
          ) : (
            <button
              type="button"
              className="sai-btn primary dtb-btn"
              onClick={send}
              disabled={phase === "sending"}
            >
              {phase === "sending" ? "Sending" : "Send tomorrow's reminders"}
            </button>
          )}
          <button
            type="button"
            className="sai-btn ghost dtb-btn"
            onClick={() => setEditing((v) => !v)}
            disabled={phase === "sending"}
          >
            {editing ? "Done editing" : "Edit message"}
          </button>
        </div>

        <p className="dtb-summary dtb-tally" aria-live="polite">
            {phase === "idle" ? (
              <>
                <span className="n">{counts.text}</span> to text, <span className="n">{counts.email}</span> to email,{" "}
                <span className="n">{counts.call}</span> to call
              </>
            ) : (
              <>
                <span className="n">{texted}</span> texted, <span className="n">{emailed}</span> emailed, <span className="n">{toCall}</span> to call
                {confirmed > 0 ? (
                  <>
                    . <span className="n">{confirmed}</span> confirmed
                  </>
                ) : null}
                {noReply > 0 ? (
                  <>
                    {confirmed > 0 ? "," : "."} <span className="n">{noReply}</span> no reply
                  </>
                ) : null}
              </>
            )}
        </p>

        <div className="dtb-rem-list" role="list" aria-label="Tomorrow's schedule">
          {SCHEDULE.map((p) => {
            const s = status[p.id];
            return (
              <div key={p.id}>
                {p.id === FIRST_AFTERNOON_ID ? <div className="dtb-rem-lunch">Lunch, 1 to 2</div> : null}
                <div className="dtb-rem-row" role="listitem">
                  <span className="dtb-rem-time">{withMeridiem(p.time)}</span>
                  <span className="dtb-rem-who">
                    <span className="dtb-rem-name">{p.name}</span>
                    <br />
                    <span className="dtb-rem-proc">{p.procedure}</span>
                  </span>
                  <span className="dtb-rem-side">
                    <span className="dtb-tag">{CHANNEL_LABEL[p.channel]}</span>
                    <span
                      className={cn(
                        "dtb-chip",
                        s === "confirmed" && "good",
                        s === "call" && "warn",
                      )}
                    >
                      {STATUS_LABEL[s]}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolFrame>
  );
}
