/**
 * Suppresses console errors and hides API URLs with IP addresses
 * This prevents sensitive 401/403 errors and API URLs from appearing in browser console
 */

export const setupErrorSuppression = () => {
  // Override console methods to filter auth-related errors and URLs
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  const shouldSuppress = (message) => {
    const str = JSON.stringify(message).toLowerCase();
    // Suppress if contains auth errors, IPs, or sensitive info
    return (
      str.includes('401') ||
      str.includes('403') ||
      str.includes('unauthorized') ||
      str.includes('forbidden') ||
      str.includes('127.0.0.1') ||
      str.includes('192.168') ||
      str.includes('localhost:8000') ||
      str.includes('api/login') ||
      str.includes('password') ||
      str.includes('phone=')
    );
  };

  console.error = function (...args) {
    // Filter out sensitive messages
    const filtered = args.filter((arg) => !shouldSuppress(arg));
    if (filtered.length > 0) {
      originalError.apply(console, filtered);
    }
  };

  console.warn = function (...args) {
    const filtered = args.filter((arg) => !shouldSuppress(arg));
    if (filtered.length > 0) {
      originalWarn.apply(console, filtered);
    }
  };

  // Override window.onerror to suppress sensitive errors
  window.onerror = function (message, source, lineno, colno, error) {
    const str = String(message).toLowerCase();
    if (
      str.includes('401') ||
      str.includes('unauthorized') ||
      str.includes('127.0.0.1') ||
      str.includes('api/login')
    ) {
      return true; // Suppress error
    }
    return false;
  };

  // Suppress unhandled promise rejections for auth endpoints
  window.addEventListener('unhandledrejection', (event) => {
    const message = JSON.stringify(event.reason).toLowerCase();
    if (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('unauthorized') ||
      message.includes('127.0.0.1') ||
      message.includes('api/login')
    ) {
      event.preventDefault();
    }
  });

  // Listen for all console messages and filter sensitive data
  const origGroups = console.group;
  console.group = function (...args) {
    if (!shouldSuppress(args)) {
      origGroups.apply(console, args);
    }
  };

  const origGroupCollapsed = console.groupCollapsed;
  console.groupCollapsed = function (...args) {
    if (!shouldSuppress(args)) {
      origGroupCollapsed.apply(console, args);
    }
  };

  // Suppress errors at fetch level
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0]?.toString() || '';
    const isAuthEndpoint =
      url.includes('/api/login') ||
      url.includes('/api/auth') ||
      url.includes('/api/logout');

    return originalFetch.apply(this, args).catch((error) => {
      if (isAuthEndpoint) {
        // Return a silent error
        return Promise.reject(new Error(''));
      }
      throw error;
    });
  };
};

