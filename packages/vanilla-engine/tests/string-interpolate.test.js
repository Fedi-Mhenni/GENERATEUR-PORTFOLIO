import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/prototypes/string-interpolate.js";

test("remplace {{ propriété }} par la valeur correspondante de data", () => {
  const result = "Bonjour {{ nom }}".interpolate({ nom: "Fedi" });

  assert.equal(result, "Bonjour Fedi");
});

test("supporte les chemins imbriqués via notation pointée {{ a.b.c }}", () => {
  const result = "Salut {{ user.profile.name }}".interpolate({
    user: { profile: { name: "Aijing" } },
  });

  assert.equal(result, "Salut Aijing");
});

test("tolère les espaces dans les accolades : {{ x }} et {{x}} identiques", () => {
  const withSpaces = "{{ nom }}".interpolate({ nom: "Fedi" });
  const withoutSpaces = "{{nom}}".interpolate({ nom: "Fedi" });

  assert.equal(withSpaces, "Fedi");
  assert.equal(withoutSpaces, "Fedi");
});

test("une clé manquante (à n'importe quel niveau) est remplacée par une chaîne vide, sans exception", () => {
  assert.doesNotThrow(() => {
    const result = "{{ inconnue }} et {{ a.b.c }}".interpolate({ a: { b: {} } });
    assert.equal(result, " et ");
  });
});

test("data undefined ou null -> ne plante pas, tous les placeholders deviennent des chaînes vides", () => {
  assert.doesNotThrow(() => {
    assert.equal("{{ a }} {{ b }}".interpolate(undefined), " ");
    assert.equal("{{ a }} {{ b }}".interpolate(null), " ");
  });
});

test("les valeurs non-string (nombre, booléen) sont converties en chaîne", () => {
  const result = "Score: {{ score }}, actif: {{ actif }}".interpolate({
    score: 42,
    actif: true,
  });

  assert.equal(result, "Score: 42, actif: true");
});

test("une chaîne sans aucun placeholder est retournée strictement inchangée", () => {
  const original = "Aucun placeholder ici.";

  assert.equal(original.interpolate({ nom: "Fedi" }), original);
});

test("plusieurs placeholders différents dans la même chaîne", () => {
  const result = "{{ prenom }} {{ nom }} ({{ age }})".interpolate({
    prenom: "Fedi",
    nom: "Mhenni",
    age: 25,
  });

  assert.equal(result, "Fedi Mhenni (25)");
});

test("le même placeholder répété plusieurs fois dans la chaîne", () => {
  const result = "{{ nom }} !== {{ nom }} ? {{ nom }}".interpolate({ nom: "Fedi" });

  assert.equal(result, "Fedi !== Fedi ? Fedi");
});
