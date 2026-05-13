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

export async function sendLabelLiveJobs(jobs: LabelLiveBatchJob[]) {
  const payload = JSON.stringify(jobs);
  const url = `${BATCH_URL}?payload=${encodeURIComponent(utf8ToBase64(payload))}`;

  try {
    const res = await fetch(url, { method: "POST" });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || `HTTP ${res.status}`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      openFallbackUri(payload);
      return;
    }
    throw error;
  }
}
