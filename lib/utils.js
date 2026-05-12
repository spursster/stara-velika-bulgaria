// Non-module version of utils.js — safe to load with a plain <script src="..."></script>

// Fetch JSON without using cache and return parsed object
window.fetchJsonNoCache = async function(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error('Fetch failed ' + res.status + ' ' + res.statusText);
    err.status = res.status;
    throw err;
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const parseErr = new Error('JSON parse error for ' + url + ': ' + e.message);
    parseErr.raw = text.slice(0, 200);
    throw parseErr;
  }
};

// Safe deep-get helper
window.safeGet = function(obj, path, defaultValue) {
  if (defaultValue === undefined) defaultValue = null;
  if (!path) return defaultValue;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return defaultValue;
    cur = cur[p];
  }
  return cur === undefined ? defaultValue : cur;
};

// Simple error logger
window.logError = function() {
  if (console && console.error) console.error.apply(console, arguments);
};
