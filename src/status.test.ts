import { strict as assert } from "node:assert";
import { test } from "node:test";
import { classify, type Invoice } from "./status.ts";

const NOW = "2026-04-23";

const make = (overrides: Partial<Invoice>): Invoice => ({
  invoice_id: "inv-1",
  due_date: "2026-04-30",
  payment_status: "unsettled",
  invoice_status: "issued",
  ...overrides,
});

test("draft の請求書は irrelevant を返す", () => {
  const result = classify([make({ invoice_status: "draft" })], NOW);
  assert.equal(result[0]?.status, "irrelevant");
});

test("cancelled の請求書は irrelevant を返す", () => {
  const result = classify([make({ invoice_status: "cancelled" })], NOW);
  assert.equal(result[0]?.status, "irrelevant");
});

test("settled で issued は settled を返す", () => {
  const result = classify([make({ payment_status: "settled" })], NOW);
  assert.equal(result[0]?.status, "settled");
});

test("unsettled で due_date が今日より 1 日前は overdue", () => {
  const result = classify([make({ due_date: "2026-04-22" })], NOW);
  assert.equal(result[0]?.status, "overdue");
});

test("unsettled で due_date が今日と同じは due_soon", () => {
  const result = classify([make({ due_date: "2026-04-23" })], NOW);
  assert.equal(result[0]?.status, "due_soon");
});

test("unsettled で due_date が今日 + 7 日は due_soon", () => {
  const result = classify([make({ due_date: "2026-04-30" })], NOW);
  assert.equal(result[0]?.status, "due_soon");
});

test("unsettled で due_date が今日 + 8 日は unsettled", () => {
  const result = classify([make({ due_date: "2026-05-01" })], NOW);
  assert.equal(result[0]?.status, "unsettled");
});

test("空配列は空配列を返す", () => {
  const result = classify([], NOW);
  assert.deepEqual(result, []);
});
