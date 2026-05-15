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

function assertSameSettings(jobs: LabelLiveBatchJob[]) {
  const design = jobs[0]?.design;
  const printerId = jobs[0]?.printerId;
  if (
    !design ||
    !printerId ||
    !jobs.every((job) => job.design === design && job.printerId === printerId)
  ) {
    throw new Error("Label LIVE multi-label printing requires one shared design and printer.");
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

  assertSameSettings(jobs);

  const design = jobs[0]!.design;
  const printerId = jobs[0]!.printerId;
  const variablesJson = variablesRowsToJson(jobs.map((job) => job.variables));
  openLabelLiveUri(printUri(design, printerId, variablesJson));
  return { openedLabelliveFallback: false };
}
