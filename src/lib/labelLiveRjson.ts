/**
 * Label LIVE "RJSON" for Integrate URLs (`variables=`). See:
 * https://label.live/guides/automated-label-printing-integration-with-production-processes
 */
export function variablesToRjson(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `${key}:'${escapeRjsonString(value)}'`)
    .join(",");
}

function escapeRjsonString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
}
