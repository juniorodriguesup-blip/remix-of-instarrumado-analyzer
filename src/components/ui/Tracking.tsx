import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface PixelEvent {
  event: string;
  data?: Record<string, any>;
}

const Tracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;

    if (!pixelId) return;

    if (!window.fbq) {
      window.fbq = function () {
        window._fbq = window._fbq || [];
        window._fbq.push(arguments);
      };
      window.fbq("init", pixelId);
    }

    window.fbq("track", "PageView");
  }, [location.pathname]);

  return null;
};

export const trackEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
};

export const trackCustomEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, data);
  }
};

export default Tracking;
