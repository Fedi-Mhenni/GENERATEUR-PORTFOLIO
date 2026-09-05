import { test } from "node:test";
import assert from "node:assert/strict";
import generateStructure from "../src/core/generate-structure.js";

// Pas de jsdom dans ce projet (aucune dépendance externe, cf. README) :
// un document minimal, simulé à la main, suffit pour observer ce que
// generateStructure() fait réellement de chaque attribut — même principe
// que le mock de globalThis.html2pdf dans generate-pdf.test.js.
function mockDocument() {
  return {
    createElement: () => ({
      dataset: {},
      classList: { add() {} },
      style: {},
      setAttribute() {},
      addEventListener() {},
      appendChild() {},
    }),
    createTextNode: (text) => ({ nodeType: "text", text }),
  };
}

function withMockDocument(run) {
  const original = globalThis.document;
  globalThis.document = mockDocument();
  try {
    return run();
  } finally {
    globalThis.document = original;
  }
}

test("data-* à un seul mot -> clé dataset inchangée (non-régression)", () => {
  const element = withMockDocument(() =>
    generateStructure({ type: "p", attributes: [["data-champ", "nom"]] }),
  );

  assert.equal(element.dataset.champ, "nom");
});

test("data-* composé (kebab-case) -> converti en camelCase sur dataset, sans planter", () => {
  const element = withMockDocument(() =>
    generateStructure({ type: "p", attributes: [["data-pdf-feedback", "true"]] }),
  );

  assert.equal(element.dataset.pdfFeedback, "true");
});

test("data-* avec plusieurs tirets -> chaque segment est capitalisé", () => {
  const element = withMockDocument(() =>
    generateStructure({ type: "p", attributes: [["data-foo-bar-baz", "valeur"]] }),
  );

  assert.equal(element.dataset.fooBarBaz, "valeur");
});
