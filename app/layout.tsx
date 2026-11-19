import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "@/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { LoaderProvider } from "@/components/site/PageLoader";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2256",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wellstarbrightss.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EDUREXA | Smart School Management Ecosystem",
    template: "%s | EDUREXA - Empowering Schools. Simplifying Education.",
  },
  description:
    "EDUREXA is an intelligent, cloud-powered, multi-tenant school management platform designed to centralize school operations, simplify administration, enhance academic management, and connect administrators, teachers, students, and parents through one integrated digital ecosystem.",
  keywords: [
    "EDUREXA",
    "Edurexa School Management System",
    "Smart School Management Ecosystem",
    "Empowering Schools. Simplifying Education.",
    "Multi-Tenant School Management SaaS",
    "school management system Uganda",
    "school ERP software",
    "cloud school management Africa",
    "school fees management system",
    "UNEB report card system",
    "Wellstar Bright Secondary School",
    "student information system",
    "school timetable and attendance software",
    "digital school ecosystem",
  ],
  authors: [{ name: "EDUREXA", url: siteUrl }],
  creator: "EDUREXA",
  publisher: "EDUREXA",
  category: "Education SaaS",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icon.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteUrl,
    siteName: "EDUREXA",
    title: "EDUREXA | Smart School Management Ecosystem",
    description:
      "Empowering Schools. Simplifying Education. The complete digital ecosystem for modern schools. Centralize school operations, simplify administration, and connect your entire educational community.",
    images: [
      {
        url: "/edurexa-og.png",
        width: 1200,
        height: 630,
        alt: "EDUREXA - Smart School Management Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDUREXA | Smart School Management Ecosystem",
    description:
      "Empowering Schools. Simplifying Education. Intelligent, cloud-powered multi-tenant school management platform.",
    images: ["/edurexa-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Intercept and suppress third-party Chrome/browser extension errors (e.g. Urban VPN, bis_skin, etc.) */}
        <script
          id="extension-error-suppressor"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                function isExtensionError(err, src, stack, msg) {
                  var str = (src || '') + ' ' + (stack || '') + ' ' + (msg || '') + ' ' + (err && err.stack ? err.stack : '') + ' ' + (err && err.message ? err.message : '');
                  return str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('moz-extension://') !== -1 ||
                         str.indexOf('safari-extension://') !== -1 ||
                         str.indexOf('M_ID') !== -1 ||
                         str.indexOf('bis_skin_checked') !== -1 ||
                         str.indexOf('executors/200.js') !== -1 ||
                         str.indexOf('eppiocemhmnlbhjplcgkofciiegomcon') !== -1;
                }

                // 1. Intercept console.error to keep Next.js dev overlay from displaying extension errors
                var rawConsoleError = console.error;
                console.error = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    var a = arguments[i];
                    var str = (typeof a === 'string') ? a : (a && (a.stack || a.message || ''));
                    if (isExtensionError(a, null, a && a.stack, str)) {
                      return; // Suppress from Next.js error interceptor
                    }
                  }
                  return rawConsoleError.apply(console, arguments);
                };

                // 2. Intercept window.onerror
                var prevOnError = window.onerror;
                window.onerror = function(msg, src, line, col, err) {
                  if (isExtensionError(err, src, err && err.stack, msg)) {
                    return true;
                  }
                  if (typeof prevOnError === 'function') {
                    return prevOnError.apply(this, arguments);
                  }
                  return false;
                };

                // 3. Intercept window error event in capture phase
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e.error, e.filename, e.error && e.error.stack, e.message)) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }, true);

                // 4. Intercept unhandledrejection
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  var str = (reason && reason.stack ? reason.stack : '') + ' ' + (reason && reason.message ? reason.message : '');
                  if (isExtensionError(reason, null, reason && reason.stack, str)) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }, true);

                // 5. Watch for Next.js error portal and auto-dismiss if it contains extension errors
                if (typeof MutationObserver !== 'undefined') {
                  var portalObserver = new MutationObserver(function() {
                    try {
                      var portals = document.querySelectorAll('nextjs-portal');
                      for (var p = 0; p < portals.length; p++) {
                        var portal = portals[p];
                        var text = (portal.shadowRoot ? portal.shadowRoot.textContent : portal.textContent) || '';
                        if (text.indexOf('M_ID') !== -1 || text.indexOf('chrome-extension://') !== -1 || text.indexOf('executors/200.js') !== -1) {
                          portal.style.display = 'none';
                          var closeBtn = portal.shadowRoot ? portal.shadowRoot.querySelector('button[aria-label="Close"]') : null;
                          if (closeBtn) closeBtn.click();
                        }
                      }
                    } catch (e) {}
                  });
                  if (document.documentElement) {
                    portalObserver.observe(document.documentElement, { childList: true, subtree: true });
                  }
                }
              })();
            `
          }}
        />
        {/* Decoy script to absorb extension injections */}
        <script id="extension-decoy" dangerouslySetInnerHTML={{ __html: "" }} suppressHydrationWarning />
        <script
          id="hydration-mismatch-fix"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;
                try {
                  function removeBisAttribute(node) {
                    if (!node || node.nodeType !== 1) return;
                    try {
                      if (typeof node.hasAttribute === 'function' && node.hasAttribute('bis_skin_checked')) {
                        node.removeAttribute('bis_skin_checked');
                      }
                      if (typeof node.getElementsByTagName === 'function') {
                        const children = node.getElementsByTagName('*');
                        if (children) {
                          for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (child && typeof child.hasAttribute === 'function' && child.hasAttribute('bis_skin_checked')) {
                              child.removeAttribute('bis_skin_checked');
                            }
                          }
                        }
                      }
                    } catch (e) {}
                  }
                  const observer = new MutationObserver((mutations) => {
                    try {
                      for (let i = 0; i < mutations.length; i++) {
                        const mutation = mutations[i];
                        if (!mutation) continue;
                        if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                          if (mutation.target && typeof mutation.target.removeAttribute === 'function') {
                            mutation.target.removeAttribute('bis_skin_checked');
                          }
                        } else if (mutation.addedNodes) {
                          for (let j = 0; j < mutation.addedNodes.length; j++) {
                            removeBisAttribute(mutation.addedNodes[j]);
                          }
                        }
                      }
                    } catch (e) {}
                  });
                  if (document.documentElement) {
                    observer.observe(document.documentElement, {
                      attributes: true,
                      childList: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Canonical SEO JSON-LD Structured Data for Google Answer Engine Optimization */}
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${sora.variable} antialiased`} suppressHydrationWarning>
        {/* Meta Pixel Tracker */}
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <script
          id="theme-initializer"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('ns_theme')==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(_){}`,
          }}
        />
        <LoaderProvider>
          {children}
        </LoaderProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

