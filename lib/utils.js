// stara-velika-bulgaria/lib/utils.js
// Non-module helpers exposed on window for simple sites.
// Provides: window.fetchJsonNoCache(url), window.safeGet(obj, path, defaultVal), window.logError(...)

(function () {
  'use strict';

  function logError() {
    if (typeof console !== 'undefined' && console.error) {
      console.error.apply(console, arguments);
    }
  }

  function safeGet(obj, path, defaultVal) {
    if (!obj) return defaultVal;
    if (typeof path === 'string') {
      path = path.replace(/

\[(\d+)\]

/g, '.$1').split('.').filter(Boolean);
    }
    try {
      return path.reduce(function (acc, key) {
        if (acc === undefined || acc === null) return undefined;
        return acc[key];
      }, obj) ?? defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  async function fetchJsonNoCache(url, opts) {
    if (!url) throw new Error('fetchJsonNoCache: url required');
    const cacheBuster = '_cb=' + Date.now();
    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = url.includes('_cb=') ? url : url + separator + cacheBuster;

    const fetchOpts = Object.assign({ credentials: 'same-origin', cache: 'no-store' }, opts || {});

    const res = await fetch(finalUrl, fetchOpts);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const msg = `Request failed: ${res.status} ${res.statusText}` + (text ? ` — ${text}` : '');
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }

    try {
      return await res.json();
    } catch (e) {
      const err = new Error('Invalid JSON response from ' + finalUrl);
      err.cause = e;
      throw err;
    }
  }

  if (typeof window !== 'undefined') {
    if (!window.logError) window.logError = logError;
    if (!window.safeGet) window.safeGet = safeGet;
    if (!window.fetchJsonNoCache) window.fetchJsonNoCache = fetchJsonNoCache;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      logError: logError,
      safeGet: safeGet,
      fetchJsonNoCache: fetchJsonNoCache
    };
  }
})();
