import type { MetadataRoute } from "next";

const BRAND_COLOR = "#ff6900";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Streapost",
    short_name: "Streapost",
    description: "Streapost is a simple posts list explorer built with Next.js, Prisma, and PostgreSQL.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: BRAND_COLOR,
    orientation: "portrait",
    icons: [
      {
        src: "/streapost-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/streapost-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
