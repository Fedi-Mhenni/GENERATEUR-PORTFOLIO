import { test } from "node:test";
import assert from "node:assert/strict";
import resolveImageUrl from "../src/utils/resolve-url.js";

test("une URL relative est préfixée avec l'origine fournie", () => {
  const result = resolveImageUrl("/uploads/photo.png", "http://localhost:1337");

  assert.equal(result, "http://localhost:1337/uploads/photo.png");
});

test("une URL déjà absolue est laissée intacte (pas de double préfixage)", () => {
  const result = resolveImageUrl(
    "https://cdn.exemple.com/uploads/photo.png",
    "http://localhost:1337",
  );

  assert.equal(result, "https://cdn.exemple.com/uploads/photo.png");
});

test("une chaîne vide est gérée sans erreur", () => {
  assert.doesNotThrow(() => {
    const result = resolveImageUrl("", "http://localhost:1337");
    assert.equal(result, "");
  });
});

test("undefined/null sont gérés sans erreur (pas d'image)", () => {
  assert.doesNotThrow(() => {
    assert.equal(resolveImageUrl(undefined, "http://localhost:1337"), "");
    assert.equal(resolveImageUrl(null, "http://localhost:1337"), "");
  });
});
