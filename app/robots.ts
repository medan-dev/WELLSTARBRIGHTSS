import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wellstarbrightss.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/teacher",
          "/teacher/*",
          "/student",
          "/student/*",
          "/api/*",
          "/finance",
          "/finance/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/*", "/teacher/*", "/student/*", "/api/*", "/finance/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

