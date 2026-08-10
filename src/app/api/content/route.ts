import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    collections: [
      "articles",
      "community",
      "education",
      "profile",
      "projects",
      "sitemap",
      "work",
    ],
  });
}
