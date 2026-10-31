import assert from "node:assert/strict";
import { test } from "node:test";
import { access } from "node:fs/promises";
import path from "node:path";
import { readBlogEntries, isPublished } from "../src/lib/content.ts";
import { ArticleSchema } from "../src/types/article.ts";
import { URLS } from "../src/components/helpers/urls.ts";

test("draft and private content is excluded from public discovery and lookups", () => {
  assert.equal(isPublished({ published: false }), false);
  assert.equal(isPublished({ published: true, private: true }), false);
  assert.equal(isPublished({ published: true }), true);
});

test("content dates reject rollover and ambiguous input", () => {
  assert.equal(ArticleSchema.shape.date.parse("2024-02-29"), "2024-02-29");
  for (const date of ["2023-02-29", "2024-02-31", "09/01/2024", "yesterday"]) {
    assert.throws(() => ArticleSchema.shape.date.parse(date));
  }
});

test("blog URLs encode path segments once", () => {
  assert.equal(URLS.ARTICLES("example-post"), "/blog/example-post");
  assert.equal(
    URLS.ARTICLE_MARKDOWN("example post"),
    "/blog/example%20post/md",
  );
});

test("blog entries have valid metadata and local image assets", async () => {
  const entries = await readBlogEntries();
  assert.equal(new Set(entries.map((item) => item.slug)).size, entries.length);
  for (const { meta, content } of entries) {
    assert.ok(content.trim(), "article body must not be empty");
    for (const image of [meta.image, meta.ogImage].filter(
      (value): value is string => Boolean(value),
    )) {
      assert.ok(image.startsWith("/"), `Image must be local: ${image}`);
      await access(path.join(process.cwd(), "public", image));
    }
  }
});

test("blog metadata rejects malformed publication flags and missing required fields", () => {
  assert.equal(ArticleSchema.safeParse({ title: "Draft" }).success, false);
  assert.equal(
    ArticleSchema.safeParse({
      title: "Post",
      description: "Post",
      date: "2024-01-01",
      tags: [],
      published: "false",
    }).success,
    false,
  );
});
