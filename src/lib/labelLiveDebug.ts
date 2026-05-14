import { variablesToRjson } from "./labelLiveRjson";

/** Same shape as jobs passed to `sendLabelLiveJobs` (standalone type avoids circular imports). */
export type LabelLiveDebugJob = {
  design: string;
  variables: Record<string, string>;
};

const BATCH_URL = "http://127.0.0.1:11180/api/v1/batch";

function utf8ToBase64(payload: string) {
  return btoa(
    encodeURIComponent(payload).replace(
      /%([0-9A-F]{2})/gi,
      (_: unknown, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)),
    ),
  );
}

function labelliveBatchHref(payloadJson: string) {
  return `labellive://batch?payload=${encodeURIComponent(utf8ToBase64(payloadJson))}`;
}

function preview(text: string, max: number) {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}\n… (${text.length} characters total)`;
}

function batchPayloadJson(jobs: LabelLiveDebugJob[]) {
  return JSON.stringify(
    jobs.map((job) => ({
      design: job.design,
      variables: variablesToRjson(job.variables),
    })),
  );
}

/** Human-readable integration details for troubleshooting (URLs, bodies, payload sizes). */
export function buildLabelLiveDebugText(jobs: LabelLiveDebugJob[]): string {
  if (!jobs.length) {
    return "(no jobs)";
  }

  let out = "";

  const payloadJson = batchPayloadJson(jobs);
  const payloadB64 = utf8ToBase64(payloadJson);
  const batchQueryUrl = `${BATCH_URL}?payload=${encodeURIComponent(payloadB64)}`;

  out += "\n=== Batch: decoded JSON (what Label LIVE should parse after base64 decode) ===\n";
  out += `${preview(payloadJson, 8000)}\n`;

  out += "\n=== Batch: payload parameter ===\n";
  out += `payload (base64, ${payloadB64.length} chars): ${preview(payloadB64, 200)}\n`;

  out += "\n=== Batch: HTTP GET with query payload (full URI length " + batchQueryUrl.length + " chars) ===\n";
  out += `${preview(batchQueryUrl, 8000)}\n`;

  out += "\n=== labellive:// fallback (if HTTP to localhost failed) ===\n";
  const ll = labelliveBatchHref(payloadJson);
  out += `Length ${ll.length} chars\n${preview(ll, 8000)}\n`;

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
