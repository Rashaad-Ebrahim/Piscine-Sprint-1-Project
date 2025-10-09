import { calculateRevisions } from "./script.mjs";
import assert from "node:assert";
import test from "node:test";

test("calculateRevisions returns correct spaced repetition dates", () => {
  const topic = "Codewars";
  const startDate = new Date("2025-10-09T00:00:00Z");
  const revisions = calculateRevisions(startDate, topic);

  assert.equal(revisions.length, 5);
  assert.equal(revisions[0].topic, topic);
  assert.equal(revisions[0].date, "2025-10-16"); // +1 week
  assert.equal(revisions[1].date, "2025-11-09"); // +1 month
  assert.equal(revisions[2].date, "2026-01-09"); // +3 months
  assert.equal(revisions[3].date, "2026-04-09"); // +6 months
  assert.equal(revisions[4].date, "2026-10-09"); // +1 year
});