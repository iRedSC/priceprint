import { variablesToRjson } from "./labelLiveRjson";

export type LabelLiveBatchJob = {
  design: string;
  variables: Record<string, string>;
};

function utf8ToBase64(payload: string) {
  return btoa(
    encodeURIComponent(payload).replace(
      /%([0-9A-F]{2})/gi,
      (_: unknown, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)),
    ),
  );
}

function labelliveBatchUri(payload: string) {
  return `labellive://batch?payload=${utf8ToBase64(payload)}`;
}

function openLabelLiveUri(payload: string) {
  const href = labelliveBatchUri(payload);
  const a = document.createElement("a");

  a.href = href;
  a.rel = "noreferrer noopener";
  a.style.display = "none";

  document.body.append(a);
  a.click();
  a.remove();
}

/**
 * Batch items mirror `labellive://print` params. The outer payload is JSON,
 * but `variables` itself is Label LIVE's RJSON string format.
 */
function jobToLabelLiveParams(job: LabelLiveBatchJob): {
  design: string;
  variables: string;
} {
  return { design: job.design, variables: variablesToRjson(job.variables) };
}

function buildBatchPayloadJson(jobs: LabelLiveBatchJob[]) {
  return JSON.stringify(jobs.map(jobToLabelLiveParams));
}

export type SendLabelLiveJobsResult = {
  /** Kept for callers that still distinguish HTTP fallback flows. */
  openedLabelliveFallback: boolean;
};

export async function sendLabelLiveJobs(
  jobs: LabelLiveBatchJob[],
): Promise<SendLabelLiveJobsResult> {
  if (!jobs.length) {
    return { openedLabelliveFallback: false };
  }

  const payloadJson = buildBatchPayloadJson(jobs);
  // HTTP can print only when Label LIVE is already open. Opening the protocol
  // directly keeps the launch tied to the user's click, so browsers allow it.
  openLabelLiveUri(payloadJson);
  return { openedLabelliveFallback: false };
}
