import { variablesToRjson } from "@/lib/labelLiveRjson";

const BATCH_URL = "http://127.0.0.1:11180/api/v1/batch";

/** Prefer v4.5+ multi-job HTTP print (one design); paths are tried in order. */
const PRINT_URLS = [
  "http://127.0.0.1:11180/api/v1/print",
  "http://127.0.0.1:11180/api/print",
] as const;

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

/** Batch jobs use the same keys as Integrate query params (`design` + RJSON `variables`). */
function jobToLabelLiveParams(job: LabelLiveBatchJob): Record<string, string> {
  return {
    design: job.design,
    variables: variablesToRjson(job.variables),
  };
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

/**
 * Multi-job with one design (HTTP v4.5+): `variables` is a JSON array of objects.
 * See Label LIVE guide: variables may be a single object or an array (HTTP).
 */
async function tryPostMultiJobPrint(design: string, variableRows: Record<string, string>[]) {
  const variablesJson =
    variableRows.length === 1
      ? JSON.stringify(variableRows[0])
      : JSON.stringify(variableRows);
  const body = new URLSearchParams({ design, variables: variablesJson });

  for (const url of PRINT_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const text = await readError(res);
      if (res.ok) {
        return true;
      }
      if (res.status !== 404 && res.status !== 405) {
        throw new Error(text || `HTTP ${res.status}`);
      }
    } catch (error) {
      if (!(error instanceof TypeError)) {
        throw error;
      }
    }
  }
  return false;
}

function assertSameDesign(jobs: LabelLiveBatchJob[]) {
  const design = jobs[0]?.design;
  if (!design || !jobs.every((j) => j.design === design)) {
    throw new Error("Label LIVE batch jobs must use the same design.");
  }
}

export async function sendLabelLiveJobs(jobs: LabelLiveBatchJob[]) {
  if (!jobs.length) {
    return;
  }

  assertSameDesign(jobs);
  const design = jobs[0]!.design;
  const variableRows = jobs.map((j) => j.variables);

  if (await tryPostMultiJobPrint(design, variableRows)) {
    return;
  }

  const payloadJson = buildBatchPayloadJson(jobs);
  const payloadB64 = utf8ToBase64(payloadJson);

  try {
    const resBody = await fetch(BATCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ payload: payloadB64 }).toString(),
    });
    const bodyText = await readError(resBody);
    if (resBody.ok) {
      return;
    }
    if (resBody.status !== 404 && resBody.status !== 405) {
      throw new Error(bodyText || `HTTP ${resBody.status}`);
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }

  try {
    const res = await fetch(`${BATCH_URL}?payload=${encodeURIComponent(payloadB64)}`, {
      method: "POST",
    });
    const text = await readError(res);
    if (!res.ok) {
      throw new Error(text || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      openFallbackUri(payloadJson);
      return;
    }
    throw error;
  }
}
