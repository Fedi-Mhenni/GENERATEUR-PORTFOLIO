import { test } from "node:test";
import assert from "node:assert/strict";
import generatePdf from "../src/pdf/generate-pdf.js";

const element = { tagName: "DIV" };

test("options invalides (filename n'est pas une string) -> aucun appel à html2pdf, success: false", async () => {
  const originalHtml2pdf = globalThis.html2pdf;
  let called = false;
  globalThis.html2pdf = () => {
    called = true;
    return Promise.resolve();
  };

  const result = await generatePdf(element, { filename: 42 });

  globalThis.html2pdf = originalHtml2pdf;

  assert.equal(called, false);
  assert.equal(result.success, false);
  assert.ok(result.errors.length > 0);
});

test("options sans filename -> appelle html2pdf avec l'élément et le filename par défaut", async () => {
  const originalHtml2pdf = globalThis.html2pdf;
  let receivedElement;
  let receivedOptions;
  globalThis.html2pdf = (el, opt) => {
    receivedElement = el;
    receivedOptions = opt;
    return Promise.resolve();
  };

  await generatePdf(element, {});

  globalThis.html2pdf = originalHtml2pdf;

  assert.equal(receivedElement, element);
  assert.equal(receivedOptions.filename, "document.pdf");
});

test("options avec filename -> appelle html2pdf avec ce filename", async () => {
  const originalHtml2pdf = globalThis.html2pdf;
  let receivedOptions;
  globalThis.html2pdf = (el, opt) => {
    receivedOptions = opt;
    return Promise.resolve();
  };

  await generatePdf(element, { filename: "cv-azer.pdf" });

  globalThis.html2pdf = originalHtml2pdf;

  assert.equal(receivedOptions.filename, "cv-azer.pdf");
});

test("html2pdf résout -> success: true, errors: []", async () => {
  const originalHtml2pdf = globalThis.html2pdf;
  globalThis.html2pdf = () => Promise.resolve();

  const result = await generatePdf(element, { filename: "cv-azer.pdf" });

  globalThis.html2pdf = originalHtml2pdf;

  assert.equal(result.success, true);
  assert.deepEqual(result.errors, []);
});
