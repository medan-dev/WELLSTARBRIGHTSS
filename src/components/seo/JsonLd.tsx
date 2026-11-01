/**
 * Comprehensive JSON-LD Structured Data Schemas
 * Optimized for Google Rich Results, Answer Engine Optimization (AEO),
 * Perplexity, Gemini, and ChatGPT Search.
 */

export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wellstarbrightss.vercel.app";

  // 1. School / EducationalOrganization Schema
  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization"],
    "@id": `${siteUrl}/#school`,
    name: "Wellstar Bright Secondary School",
    alternateName: [
      "Wellstar Bright SS",
      "Wellstar Bright Mukono",
      "Wellstar Bright SDA Secondary School",
      "Kabembe Secondary School",
      "Wellstar Bright Secondary School Kabembe"
    ],
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/hero-campus.jpg`,
    description:
      "Wellstar Bright Secondary School is a premier Seventh-day Adventist (SDA) mixed day and boarding secondary school in Kabembe, Mukono District, Uganda. We offer holistic Christian O-Level and A-Level UNEB education with a focus on science, ICT, moral character, and spiritual excellence.",
    slogan: "Excellence in Mind, Character, and Spirit",
    foundingDate: "2012",
    religiousAffiliation: "Seventh-day Adventist (SDA)",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kabembe, off Kampala-Jinja & Kayunga Road",
      addressLocality: "Mukono",
      addressRegion: "Central Region",
      addressCountry: "UG"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.3533,
      longitude: 32.7553
    },
    hasMap: "https://www.google.com/search?q=Wellstar+Bright+Secondary+School+Kabembe+Mukono",
    telephone: "+256 701 116 781",
    email: "info@wellstarbrightss.ac.ug",
    priceRange: "UGX - Moderate & Value Driven with Bursaries",
    curriculum: [
      "Uganda National Curriculum (UNEB)",
      "Lower Secondary O-Level (UCE)",
      "Upper Secondary A-Level (UACE)",
      "STEM & Practical ICT Training"
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Uganda Certificate of Education (UCE)"
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Uganda Advanced Certificate of Education (UACE)"
      }
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Modern Science Laboratories (Physics, Chemistry, Biology)", value: true },
      { "@type": "LocationFeatureSpecification", name: "High-Speed Computer & ICT Laboratory", value: true },
      { "@type": "LocationFeatureSpecification", name: "Secure Separate Boys and Girls Boarding Facilities", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sports Grounds (Football, Netball, Volleyball, Athletics)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Adventist Chaplaincy & Music Ministry", value: true }
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Secondary School Admissions (S.1 to S.6)",
      url: `${siteUrl}/apply`,
      availability: "https://schema.org/InStock",
      category: "Admissions"
    },
    sameAs: [
      "https://facebook.com/wellstarbrightss",
      "https://wa.me/256701116781"
    ]
  };

  // 2. Relatable Parent & Student FAQ Schema (Google Answer Engine Optimization)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is Wellstar Bright ranked among the top secondary schools in Mukono?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wellstar Bright Secondary School in Kabembe, Mukono has built a reputable track record of academic excellence with high UNEB Division 1 passes in both UCE (O-Level) and UACE (A-Level). We provide dedicated teachers, modern science and ICT laboratories, rigorous academic mentoring, and a calm campus environment away from city distractions."
        }
      },
      {
        "@type": "Question",
        name: "What makes Adventist / SDA education at Wellstar Bright unique?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As a Seventh-day Adventist (SDA) school, we prioritize the balanced development of the whole person: Mind, Body, and Spirit. Students benefit from strong moral character formation, spiritual nurture, healthy lifestyle principles, and high personal discipline that prepares them for lifelong success."
        }
      },
      {
        "@type": "Question",
        name: "Does Wellstar Bright accept non-Adventist students?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, absolutely! Wellstar Bright warmly welcomes students of all religious beliefs and Christian denominations who respect our Christian values and desire an uplifting, disciplined, and high-achieving learning community."
        }
      },
      {
        "@type": "Question",
        name: "Where is Wellstar Bright Secondary School located in Mukono, Uganda?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The school is conveniently located at Kabembe in Mukono District, Uganda, easily accessible from the Kampala-Jinja highway and Kayunga road. We offer safe, serene boarding and day scholar facilities."
        }
      },
      {
        "@type": "Question",
        name: "What classes and academic combinations are offered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer Senior 1 to Senior 4 (Lower Secondary O-Level under the new competence-based curriculum) and Senior 5 to Senior 6 (A-Level with popular combinations in Sciences: PCB, PCM, BCM, PEM and Arts/Humanities: HEL, MEA, HEG, DEG, plus ICT and Sub-Math)."
        }
      },
      {
        "@type": "Question",
        name: "How can parents apply for S.1 or S.5 admission?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parents can easily apply online in 3 minutes via wellstarbrightss.vercel.app/apply, submit PLE or UCE results, or chat directly with the Admissions Office on WhatsApp at +256 701 116 781 for immediate guidance."
        }
      },
      {
        "@type": "Question",
        name: "Are school fees affordable, and are there scholarships or bursaries?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Wellstar Bright is committed to offering quality, high-standard secondary education at competitive, family-friendly fees. We also provide academic merit scholarships for outstanding PLE/UCE performers and means-tested support for qualifying families."
        }
      }
    ]
  };

  // 3. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Admissions & Apply",
        item: `${siteUrl}/apply`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Academics",
        item: `${siteUrl}/academics`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "About School",
        item: `${siteUrl}/about`
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: `${siteUrl}/contact`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

