/**
 * Comprehensive JSON-LD Structured Data Schemas for EDUREXA
 * Optimized for Google Rich Results, Answer Engine Optimization (AEO),
 * Perplexity, Gemini, and ChatGPT Search.
 */

export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edurexa.com";

  // 1. SoftwareApplication / Organization Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Organization"],
    "@id": `${siteUrl}/#software`,
    name: "EDUREXA",
    alternateName: [
      "EDUREXA School Management System",
      "Edurexa Cloud Platform",
      "Edurexa SMS"
    ],
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser, iOS, Android",
    description:
      "EDUREXA is an intelligent multi-tenant cloud school management ecosystem designed for modern educational institutions across Uganda and Africa.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UGX",
      description: "Free 4-Hour Live Interactive Demo for Schools"
    },
    telephone: "+256 758 611 414",
    email: "sales@edurexa.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressRegion: "Central Region",
      addressCountry: "UG"
    },
    sameAs: [
      "https://wa.me/256758611414"
    ]
  };

  // 2. EDUREXA FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is EDUREXA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EDUREXA is an all-in-one cloud-powered multi-tenant school management ecosystem designed to streamline school admissions, academic grading with UNEB compliance, automated fee collection and anti-leakage reconciliations, and multi-campus governance."
        }
      },
      {
        "@type": "Question",
        name: "Can our school test EDUREXA before onboarding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. EDUREXA provides a completely free, 4-hour live interactive sandbox demonstration where school directors, headteachers, and bursars can test every single module in real-time."
        }
      },
      {
        "@type": "Question",
        name: "How can schools contact the EDUREXA team?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schools can chat directly with our executive sales and implementation engineering team on WhatsApp at +256 758 611 414 or email sales@edurexa.com."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
