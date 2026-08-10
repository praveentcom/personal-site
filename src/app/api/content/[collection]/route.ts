import { NextResponse } from "next/server";

import {
  type ContentCollection,
  getManifestByCollection,
} from "@/components/helpers/content-source";

interface RouteContext {
  params: Promise<{
    collection: string;
  }>;
}

function isContentCollection(value: string): value is ContentCollection {
  return [
    "articles",
    "community",
    "education",
    "profile",
    "projects",
    "sitemap",
    "work",
  ].includes(value);
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { collection } = await params;

  if (!isContentCollection(collection)) {
    return NextResponse.json(
      { error: "Unknown content collection" },
      { status: 404 },
    );
  }

  const manifest = await getManifestByCollection(collection);
  return NextResponse.json(manifest);
}
