import { createHealthResponse } from "@workspace/web-runtime/health-route";

export const dynamic = "force-dynamic";

export function GET() {
  return createHealthResponse("praveen-website");
}
