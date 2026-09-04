import { test } from "node:test";
import assert from "node:assert/strict";
import getCvUrl from "../src/utils/get-cv-url.js";

test("profil.cv présent avec une URL relative -> URL complète préfixée avec l'origine", () => {
  const result = getCvUrl({ cv: { url: "/uploads/cv.pdf" } }, "http://localhost:1337");

  assert.equal(result, "http://localhost:1337/uploads/cv.pdf");
});

test("profil.cv présent avec une URL déjà absolue -> laissée intacte", () => {
  const result = getCvUrl(
    { cv: { url: "https://cdn.exemple.com/cv.pdf" } },
    "http://localhost:1337",
  );

  assert.equal(result, "https://cdn.exemple.com/cv.pdf");
});

test("profil.cv est null -> null (pas de fichier uploadé dans Strapi)", () => {
  assert.equal(getCvUrl({ cv: null }, "http://localhost:1337"), null);
});

test("profil.cv est absent du schema -> null", () => {
  assert.equal(getCvUrl({}, "http://localhost:1337"), null);
});

test("profil lui-même est undefined/null -> null, jamais d'exception", () => {
  assert.doesNotThrow(() => {
    assert.equal(getCvUrl(undefined, "http://localhost:1337"), null);
    assert.equal(getCvUrl(null, "http://localhost:1337"), null);
  });
});
