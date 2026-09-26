import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  getLightPeriod,
  lightPeriodBootstrapScript,
} from "../src/components/helpers/light-period.ts";

test("light appearance switches at 8am and 4pm local time", () => {
  for (const [hour, expected] of [
    [0, "dusk"],
    [7, "dusk"],
    [8, "day"],
    [15, "day"],
    [16, "dusk"],
    [23, "dusk"],
  ] as const) {
    assert.equal(getLightPeriod(hour), expected);
  }
});

test("bootstrap applies local appearance before hydration", () => {
  const document = {
    documentElement: { dataset: {} as Record<string, string> },
  };
  class MorningDate {
    getHours() {
      return 7;
    }
  }
  vm.runInNewContext(lightPeriodBootstrapScript, {
    document,
    Date: MorningDate,
  });
  assert.equal(document.documentElement.dataset.lightPeriod, "dusk");
});

test("a chosen day appearance overrides the automatic twilight period", () => {
  const document = {
    documentElement: { dataset: {} as Record<string, string> },
  };
  class EveningDate {
    getHours() {
      return 19;
    }
  }
  vm.runInNewContext(lightPeriodBootstrapScript, {
    document,
    Date: EveningDate,
    localStorage: { getItem: () => "day" },
  });
  assert.equal(document.documentElement.dataset.lightPeriod, "day");
});
