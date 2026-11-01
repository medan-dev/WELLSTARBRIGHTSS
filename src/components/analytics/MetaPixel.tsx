"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Extend global Window interface for Meta Pixel fbq
declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      loaded?: boolean;
      version?: string;
      push?: (...args: any[]) => void;
    };
    _fbq?: any;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1148817633288421";

/**
 * Standard Meta Pixel event tracking helper
 * e.g., trackMetaEvent('Lead', { form: 'admission' })
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("track", eventName, params);
      } else {
        window.fbq("track", eventName);
      }
    } catch (err) {
      console.warn("Meta Pixel track error:", err);
    }
  }
}

/**
 * Custom Meta Pixel event tracking helper
 */
export function trackCustomMetaEvent(customEventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("trackCustom", customEventName, params);
      } else {
        window.fbq("trackCustom", customEventName);
      }
    } catch (err) {
      console.warn("Meta Pixel custom track error:", err);
    }
  }
}

/**
 * Meta Pixel Client Component
 * Initializes the Facebook Pixel script and fires PageView on route changes
 */
export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track PageView on route change
  useEffect(() => {
    if (pathname && typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
}

