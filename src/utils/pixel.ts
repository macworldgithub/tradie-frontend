// Meta Pixel tracking utility helper

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Standard Meta Pixel Events
 */
export const trackPixelEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  } else {
    // Retry once in case script is still loading
    setTimeout(() => {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        if (params) {
          window.fbq("track", eventName, params);
        } else {
          window.fbq("track", eventName);
        }
      }
    }, 1000);
  }
};

/**
 * Custom Meta Pixel Events
 */
export const trackCustomPixelEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("trackCustom", eventName);
    }
  }
};
