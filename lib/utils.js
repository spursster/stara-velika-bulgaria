// Minimal utils used by the app. Keep this file at lib/utils.js
export async function fetchJsonNoCache(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error(`Fetch failed ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const parseErr = new Error(`JSON parse error for ${url}: ${e.message}`);
    parseErr.raw = text.slice(0, 200);
    throw parseErr;
  }
}

export function safeGet(obj, path, defaultValue = null) {
  if (!path) return defaultValue;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return defaultValue;
    cur = cur[p];
  }
  return cur === undefined ? defaultValue : cur;
}

export function logError(...args) {
  if (console && console.error) console.error(...args);
}
