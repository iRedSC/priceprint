/** Same shape as jobs passed to `sendLabelLiveJobs` (standalone type avoids circular imports). */
export type LabelLiveDebugJob = {
  design: string;
  printerId: string;
  variables: Record<string, string>;
};

export type LabelLiveDebugMessage = {
  title: string;
  description: string;
  detail: string;
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
    "window=hide",
    "copies=1",
  ];

  return `labellive://print?${params.join("&")}`;
}

function batchJobsBySettings(jobs: LabelLiveDebugJob[]) {
  const batches = new Map<string, LabelLiveDebugJob[]>();

  for (const job of jobs) {
    const key = `${job.design}\0${job.printerId}`;
    batches.set(key, [...(batches.get(key) ?? []), job]);
  }

  return [...batches.values()];
}

/** Human-readable integration details for troubleshooting (URLs, bodies, payload sizes). */
export function buildLabelLiveDebugText(jobs: LabelLiveDebugJob[]): string {
  if (!jobs.length) {
    return "(no jobs)";
  }

  let out = "";
  const batches = batchJobsBySettings(jobs);

  batches.forEach((batch, index) => {
    const design = batch[0]!.design;
    const printerId = batch[0]!.printerId;
    const variablesJson = variablesRowsToJson(batch.map((job) => job.variables));
    const href = printUri(design, printerId, variablesJson);

    if (batches.length > 1) {
      out += `=== Batch ${index + 1}: ${design} (${batch.length} job(s)) ===\n`;
    } else {
      out += jobs.length === 1 ? "=== Print URI ===\n" : "=== Multi-label print URI ===\n";
    }
    out += `${preview(href, 8000)}\n`;

    out += "\n=== Decoded variables JSON ===\n";
    out += `${preview(variablesJson, 8000)}\n`;

    if (index < batches.length - 1) {
      out += "\n";
    }
  });

  return out;
}

export function logLabelLiveDebug(jobs: LabelLiveDebugJob[]) {
  const text = buildLabelLiveDebugText(jobs);
  console.error("[Label LIVE integration debug]\n\n" + text);
}

export function buildLabelLiveSendFailedMessage(
  error: unknown,
  jobs: LabelLiveDebugJob[],
): LabelLiveDebugMessage {
  logLabelLiveDebug(jobs);
  const base = error instanceof Error ? error.message : "Could not reach Label LIVE.";
  const detail = buildLabelLiveDebugText(jobs);
  return {
    title: "Could not send labels",
    description: base,
    detail,
  };
}

/** When `sendLabelLiveJobs` falls back to opening `labellive://` (HTTP to localhost failed). */
export function buildLabelLiveProtocolFallbackMessage(
  jobs: LabelLiveDebugJob[],
  extraFooter?: string,
): LabelLiveDebugMessage {
  logLabelLiveDebug(jobs);
  const footer = extraFooter?.trim();
  return {
    title: "Opened Label LIVE fallback",
    description:
      "The browser could not reach Label LIVE over HTTP, so a labellive:// URL was opened instead.",
    detail: footer
      ? `${buildLabelLiveDebugText(jobs)}\n\n${footer}`
      : buildLabelLiveDebugText(jobs),
  };
}
