/** Same shape as jobs passed to `sendLabelLiveJobs` (standalone type avoids circular imports). */
export type LabelLiveDebugJob = {
  design: string;
  printerId: string;
  variables: Record<string, string>;
};

function preview(text: string, max: number) {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}\n… (${text.length} characters total)`;
}

function variablesRowsToJson(rows: Record<string, string>[]) {
  if (rows.length === 1) {
    return JSON.stringify(rows[0]);
  }

  return JSON.stringify(rows);
}

function printUri(design: string, printerId: string, variablesJson: string) {
  const params = [
    `design=${encodeURIComponent(design)}`,
    `variables=${encodeURIComponent(variablesJson)}`,
    `printer=${encodeURIComponent(printerId)}`,
    "window=show",
    "copies=1",
  ];

  return `labellive://print?${params.join("&")}`;
}

/** Human-readable integration details for troubleshooting (URLs, bodies, payload sizes). */
export function buildLabelLiveDebugText(jobs: LabelLiveDebugJob[]): string {
  if (!jobs.length) {
    return "(no jobs)";
  }

  const designs = new Set(jobs.map((job) => job.design));
  const printerIds = new Set(jobs.map((job) => job.printerId));
  let out =
    designs.size > 1 || printerIds.size > 1
      ? "WARNING: multi-label printing requires one shared design and printer.\n\n"
      : "";

  const design = jobs[0]!.design;
  const printerId = jobs[0]!.printerId;
  const variablesJson = variablesRowsToJson(jobs.map((job) => job.variables));
  const href = printUri(design, printerId, variablesJson);

  out += "=== Multi-label print URI ===\n";
  out += `${preview(href, 8000)}\n`;

  out += "\n=== Decoded variables JSON ===\n";
  out += `${preview(variablesJson, 8000)}\n`;

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
