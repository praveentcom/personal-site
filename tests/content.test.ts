import assert from "node:assert/strict";
import { test } from "node:test";
import { access } from "node:fs/promises";
import path from "node:path";
import { readEntries, isPublished, contentYear } from "../src/lib/content.ts";
import { ArticleSchema } from "../src/types/article.ts";
import { AppSchema } from "../src/types/app.ts";
import { WorkExperienceSchema } from "../src/types/work.ts";
import { EducationSchema } from "../src/types/education.ts";
import { CommunitySchema } from "../src/types/community.ts";
import { URLS } from "../src/components/helpers/urls.ts";

test("draft and private content is excluded from public discovery and lookups", () => {
  assert.equal(isPublished({ published: false }), false);
  assert.equal(isPublished({ published: true, private: true }), false);
  assert.equal(isPublished({ published: true }), true);
});

test("content dates reject rollover and ambiguous input", () => {
  assert.equal(contentYear("2024-02-29"), "2024");
  for (const date of ["2023-02-29", "2024-02-31", "09/01/2024", "yesterday"]) {
    assert.throws(() => contentYear(date));
  }
});

test("blog URLs omit the year and encode tag names once", () => {
  assert.equal(URLS.ARTICLES("aws-s3-glacier"), "/blog/aws-s3-glacier");
  assert.equal(
    URLS.ARTICLES_TAG("Google Cloud Platform"),
    "/blog/tag/Google%20Cloud%20Platform",
  );
});

test("every content entry has valid metadata and its image assets exist locally", async () => {
  const groups = await Promise.all([
    readEntries("blog", ArticleSchema),
    readEntries("apps", AppSchema),
    readEntries("work", WorkExperienceSchema),
    readEntries("education", EducationSchema),
    readEntries("community", CommunitySchema),
  ]);
  assert.ok(groups.flat().length > 0);
  for (const group of groups) {
    assert.equal(new Set(group.map((item) => item.slug)).size, group.length);
    for (const { meta, content } of group) {
      const date = "date" in meta ? meta.date : meta.startDate;
      contentYear(date);
      if ("tags" in meta)
        assert.ok(content.trim(), "article body must not be empty");
      for (const image of [meta.image, meta.ogImage].filter(
        (value): value is string => Boolean(value),
      )) {
        assert.ok(image.startsWith("/"), `Image must be local: ${image}`);
        await access(path.join(process.cwd(), "public", image));
      }
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
