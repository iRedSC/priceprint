export type LabelLiveBatchJob = {
  design: string;
  printerId: string;
  variables: Record<string, string>;
};

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

function batchJobsBySettings(jobs: LabelLiveBatchJob[]) {
  const batches = new Map<string, LabelLiveBatchJob[]>();

  for (const job of jobs) {
    if (!job.design || !job.printerId) {
      throw new Error("Label LIVE printing requires a design and printer.");
    }

    const key = `${job.design}\0${job.printerId}`;
    batches.set(key, [...(batches.get(key) ?? []), job]);
  }

  return [...batches.values()];
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

  for (const batch of batchJobsBySettings(jobs)) {
    const design = batch[0]!.design;
    const printerId = batch[0]!.printerId;
    const variablesJson = variablesRowsToJson(batch.map((job) => job.variables));
    openLabelLiveUri(printUri(design, printerId, variablesJson));
  }

  return { openedLabelliveFallback: false };
}
