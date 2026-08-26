import { test } from "node:test";
import assert from "node:assert/strict";
import validateProps from "../src/validation/validate-props.js";

const schema = {
  titre: { type: "string", required: true },
  featured: { type: "boolean", required: false, default: false },
  count: { type: "number", required: false },
};

test("toutes les props requises présentes et du bon type -> valid: true, errors: []", () => {
  const result = validateProps({ titre: "Mon projet", featured: true }, schema);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("une prop requise manquante -> valid: false, error explicite", () => {
  const result = validateProps({}, schema);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("titre est requis"));
});

test("une prop du mauvais type -> valid: false, error explicite", () => {
  const result = validateProps({ titre: "Mon projet", featured: "oui" }, schema);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("featured doit être un boolean, reçu string"));
});

test("une prop optionnelle absente -> complétée avec sa valeur default", () => {
  const result = validateProps({ titre: "Mon projet" }, schema);

  assert.equal(result.props.featured, false);
});

test("une prop optionnelle absente sans default -> pas d'erreur, absente du résultat", () => {
  const result = validateProps({ titre: "Mon projet" }, schema);

  assert.equal(result.valid, true);
  assert.equal("count" in result.props, false);
});

test("plusieurs erreurs simultanées (requise manquante + mauvais type) -> les deux dans errors", () => {
  const result = validateProps({ featured: "oui" }, schema);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.includes("titre est requis"));
  assert.ok(result.errors.includes("featured doit être un boolean, reçu string"));
});

test("une prop requise valant null -> traitée comme absente, valid: false", () => {
  const result = validateProps({ titre: null }, schema);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("titre est requis"));
});

test("une prop optionnelle valant null -> complétée avec sa valeur default", () => {
  const result = validateProps({ titre: "Mon projet", featured: null }, schema);

  assert.equal(result.valid, true);
  assert.equal(result.props.featured, false);
});

test("une prop hors schema -> présente dans le résultat, sans erreur", () => {
  const result = validateProps(
    { titre: "Mon projet", extra: "valeur libre" },
    schema,
  );

  assert.equal(result.valid, true);
  assert.equal(result.props.extra, "valeur libre");
});
