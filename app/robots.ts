import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/account", "/cart", "/checkout", "/wishlist"],
      },
    ],
    sitemap: "https://alboshop.com.ar/sitemap.xml",
  }
}
