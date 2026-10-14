export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      ok: true,
      service: "praveen-website",
      checkedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
