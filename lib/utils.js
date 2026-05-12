// stara-velika-bulgaria/lib/utils.js
// Non-module helpers exposed on window for simple sites.
// Provides: window.fetchJsonNoCache(url), window.safeGet(obj, path, defaultVal), window.logError(...)

(function () {
  'use strict';

  /**
   * Log errors to console if available
   */
  function logError() {
    if (typeof console !== 'undefined' && console.error) {
      console.error.apply(console, arguments);
    }
  }

  /**
   * Safely retrieve nested object properties with a default fallback
   * @param {Object} obj - The object to traverse
   * @param {string|Array} path - Dot-notation path (e.g., 'user.profile.name' or 'items[0].id')
   * @param {*} defaultVal - Value to return if path doesn't exist
   * @returns {*} The value at path or defaultVal
   */
  function safeGet(obj, path, defaultVal) {
    if (obj === undefined || obj === null) return defaultVal;
    if (!path) return defaultVal;
    
    if (typeof path === 'string') {
      path = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
    }
    
    if (!Array.isArray(path)) return defaultVal;
    
    try {
      return path.reduce(function (acc, key) {
        if (acc === undefined || acc === null) return undefined;
        return acc[key];
      }, obj) ?? defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  /**
   * Fetch JSON with cache busting
   * @param {string} url - The URL to fetch
   * @param {Object} opts - Fetch options (merged with defaults)
   * @returns {Promise<*>} Parsed JSON response
   * @throws {Error} On network error, invalid status, or invalid JSON
   */
  async function fetchJsonNoCache(url, opts) {
    if (!url) throw new Error('fetchJsonNoCache: url required');
    
    const cacheBuster = '_cb=' + Date.now();
    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = url.includes('_cb=') ? url : url + separator + cacheBuster;

    const fetchOpts = Object.assign({ 
      credentials: 'same-origin', 
      cache: 'no-store' 
    }, opts || {});

    try {
      const res = await fetch(finalUrl, fetchOpts);
      
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const msg = `Request failed: ${res.status} ${res.statusText}` + (text ? ` — ${text}` : '');
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content-type: expected application/json, got ' + (contentType || 'none'));
      }

      return await res.json();
    } catch (e) {
      if (e instanceof TypeError) {
        const err = new Error('Network error: ' + e.message);
        err.cause = e;
        throw err;
      }
      throw e;
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
