import { createHealthResponse } from "@avgeek-inc/runtime-web/health-route";

export const dynamic = "force-dynamic";

export function GET() {
  return createHealthResponse("praveen-website");
}
