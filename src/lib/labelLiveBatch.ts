import { variablesToRjson } from "./labelLiveRjson";

const BATCH_URL = "http://127.0.0.1:11180/api/v1/batch";

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
  return `labellive://batch?payload=${encodeURIComponent(utf8ToBase64(payload))}`;
}

function openFallbackUri(payload: string) {
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

async function readError(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export type SendLabelLiveJobsResult = {
  /** True when fetch to localhost failed and `labellive://batch?payload=…` was opened instead. */
  openedLabelliveFallback: boolean;
};

export async function sendLabelLiveJobs(
  jobs: LabelLiveBatchJob[],
): Promise<SendLabelLiveJobsResult> {
  if (!jobs.length) {
    return { openedLabelliveFallback: false };
  }

  const payloadJson = buildBatchPayloadJson(jobs);
  const payloadB64 = utf8ToBase64(payloadJson);
  const batchUrl = `${BATCH_URL}?payload=${encodeURIComponent(payloadB64)}`;

  try {
    const res = await fetch(batchUrl);
    const text = await readError(res);
    if (res.ok) {
      return { openedLabelliveFallback: false };
    }
    if (res.status === 404 || res.status === 405) {
      openFallbackUri(payloadJson);
      return { openedLabelliveFallback: true };
    }
    throw new Error(text || `HTTP ${res.status}`);
  } catch (error) {
    if (error instanceof TypeError) {
      openFallbackUri(payloadJson);
      return { openedLabelliveFallback: true };
    }
    throw error;
  }
}
