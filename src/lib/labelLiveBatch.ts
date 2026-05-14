import { variablesToRjson } from "./labelLiveRjson";

export type LabelLiveBatchJob = {
  design: string;
  variables: Record<string, string>;
};

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

function openLabelLiveUri(href: string) {
  const a = document.createElement("a");

  console.info("[Label LIVE] Opening URL:", href);

  a.href = href;
  a.rel = "noreferrer noopener";
  a.style.display = "none";

  document.body.append(a);
  a.click();
  a.remove();
}

function assertSameDesign(jobs: LabelLiveBatchJob[]) {
  const design = jobs[0]?.design;
  if (!design || !jobs.every((job) => job.design === design)) {
    throw new Error("Label LIVE multi-label printing requires one shared design.");
  }
}

export type SendLabelLiveJobsResult = {
  /** Kept for callers that still distinguish older protocol fallback flows. */
  openedLabelliveFallback: boolean;
};

export async function sendLabelLiveJobs(
  jobs: LabelLiveBatchJob[],
): Promise<SendLabelLiveJobsResult> {
  if (!jobs.length) {
    return { openedLabelliveFallback: false };
  }

  assertSameDesign(jobs);

  const design = jobs[0]!.design;
  const variables = variablesRowsToRjson(jobs.map((job) => job.variables));
  openLabelLiveUri(printUri(design, variables));
  return { openedLabelliveFallback: false };
}
