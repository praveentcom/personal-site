import { createRSSResponse } from "@/components/helpers/rss";

export const dynamic = "force-static";
export const revalidate = 3600;

export const GET = createRSSResponse;
