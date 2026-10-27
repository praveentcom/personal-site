import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatStars,
  getGitHubStars,
  githubRepoUrl,
} from "../src/components/helpers/github.ts";

test("star counts are compact", () => {
  assert.equal(formatStars(42), "42");
  assert.equal(formatStars(1234), "1.2K");
});

test("creations link stars to their GitHub repository", () => {
  assert.equal(
    githubRepoUrl("praveen-thirumurugan/vitalog"),
    "https://github.com/praveen-thirumurugan/vitalog",
  );
});

test("star lookups fall back to null when GitHub is unavailable", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("", { status: 403 }),
  );
  assert.equal(await getGitHubStars("avgeek-oss/towbar"), null);
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ stargazers_count: 7 }),
  );
  assert.equal(await getGitHubStars("avgeek-oss/towbar"), 7);
});
