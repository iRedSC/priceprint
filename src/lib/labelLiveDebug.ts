import { variablesToRjson } from "./labelLiveRjson";

/** Same shape as jobs passed to `sendLabelLiveJobs` (standalone type avoids circular imports). */
export type LabelLiveDebugJob = {
  design: string;
  variables: Record<string, string>;
};

function preview(text: string, max: number) {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}\n… (${text.length} characters total)`;
}

function variablesRowsToRjson(rows: Record<string, string>[]) {
  if (rows.length === 1) {
    return variablesToRjson(rows[0]!);
  }

  return `[${rows.map((row) => `{${variablesToRjson(row)}}`).join(",")}]`;
}

function escapeLabelLiveParam(value: string) {
  return value.replace(/&/g, "\\&");
}

function printUri(design: string, variables: string) {
  return `labellive://print?design=${escapeLabelLiveParam(design)}&variables=${escapeLabelLiveParam(variables)}`;
}

/** Human-readable integration details for troubleshooting (URLs, bodies, payload sizes). */
export function buildLabelLiveDebugText(jobs: LabelLiveDebugJob[]): string {
  if (!jobs.length) {
    return "(no jobs)";
  }

  const designs = new Set(jobs.map((job) => job.design));
  let out =
    designs.size > 1 ? "WARNING: multi-label printing requires one shared design.\n\n" : "";

  const design = jobs[0]!.design;
  const variables = variablesRowsToRjson(jobs.map((job) => job.variables));
  const href = printUri(design, variables);

  out += "=== Multi-label print URI ===\n";
  out += `${preview(href, 8000)}\n`;

  out += "\n=== Decoded variables value ===\n";
  out += `${preview(variables, 8000)}\n`;

  return out;
}

export function logLabelLiveDebug(jobs: LabelLiveDebugJob[]) {
  const text = buildLabelLiveDebugText(jobs);
  console.error("[Label LIVE integration debug]\n\n" + text);
}

const ALERT_MAX = 14_000;

export function alertLabelLiveSendFailed(error: unknown, jobs: LabelLiveDebugJob[]) {
  logLabelLiveDebug(jobs);
  const base = error instanceof Error ? error.message : "Could not reach Label LIVE.";
  const detail = buildLabelLiveDebugText(jobs);
  const combined = `${base}\n\n--- Generated integration details (full text also in console: F12) ---\n\n${detail}`;
  window.alert(combined.length > ALERT_MAX ? combined.slice(0, ALERT_MAX) + "\n…" : combined);
}

/** When `sendLabelLiveJobs` falls back to opening `labellive://` (HTTP to localhost failed). */
export function alertLabelLiveProtocolFallback(jobs: LabelLiveDebugJob[], extraFooter?: string) {
  logLabelLiveDebug(jobs);
  const detail = buildLabelLiveDebugText(jobs);
  let combined =
    "The browser could not reach Label LIVE over HTTP (localhost:11180), so a labellive:// URL was opened instead.\n\n" +
    "If Label LIVE shows an error, inspect this payload (full text also in console: F12):\n\n" +
    detail;
  if (extraFooter?.trim()) {
    combined += `\n\n${extraFooter.trim()}`;
  }
  window.alert(combined.length > ALERT_MAX ? combined.slice(0, ALERT_MAX) + "\n…" : combined);
}
