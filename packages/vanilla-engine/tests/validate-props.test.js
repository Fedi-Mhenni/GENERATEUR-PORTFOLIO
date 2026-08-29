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

test("une prop requise valant '' -> traitée comme absente, valid: false", () => {
  const result = validateProps({ titre: "" }, schema);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("titre est requis"));
});

test("une prop optionnelle valant '' -> reste valide, pas remplacée par erreur (contrairement à required)", () => {
  const result = validateProps({ titre: "Mon projet", featured: "" }, schema);
  assert.ok(result.errors.includes("featured doit être un boolean, reçu string"));
  assert.ok(!result.errors.includes("featured est requis"));
});

test("un champ optionnel string avec default: '' accepte '' explicitement, sans erreur (ex: Carte.image)", () => {
  const optionalSchema = {
    image: { type: "string", required: false, default: "" },
  };
  const result = validateProps({ image: "" }, optionalSchema);

  assert.equal(result.valid, true);
  assert.equal(result.props.image, "");
});

test("une prop hors schema -> présente dans le résultat, sans erreur", () => {
  const result = validateProps(
    { titre: "Mon projet", extra: "valeur libre" },
    schema,
  );

  assert.equal(result.valid, true);
  assert.equal(result.props.extra, "valeur libre");
});

const formSchema = {
  email: {
    type: "string",
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: {
    type: "string",
    required: true,
    minLength: 10,
  },
};

test("pattern : une valeur qui ne respecte pas le format -> valid: false, error explicite", () => {
  const result = validateProps(
    { email: "pas-un-email", message: "1234567890" },
    formSchema,
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("email ne respecte pas le format attendu"));
});

test("pattern : une valeur qui respecte le format -> pas d'erreur pour ce champ", () => {
  const result = validateProps(
    { email: "fedi@exemple.fr", message: "1234567890" },
    formSchema,
  );

  assert.equal(result.valid, true);
});

test("minLength : une chaîne trop courte -> valid: false, error explicite", () => {
  const result = validateProps(
    { email: "fedi@exemple.fr", message: "court" },
    formSchema,
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("message doit contenir au moins 10 caractères"));
});

test("minLength : une chaîne assez longue -> pas d'erreur pour ce champ", () => {
  const result = validateProps(
    { email: "fedi@exemple.fr", message: "1234567890" },
    formSchema,
  );

  assert.equal(result.valid, true);
});

test("pattern/minLength absents du schema -> aucun impact (non-régression)", () => {
  const result = validateProps({ titre: "Mon projet", featured: true }, schema);

  assert.equal(result.valid, true);
});

test("pattern/minLength sur une valeur non-string -> pas d'erreur redondante due à la coercion (seule l'erreur de type remonte)", () => {
  // Sans le garde-fou typeof, RegExp.test(42) coercerait 42 en "42" : ça ne
  // matche pas le pattern email, donc une 2e erreur "format" apparaîtrait en
  // plus de l'erreur de type — redondant et dépendant d'une coercion
  // accidentelle plutôt que de la vraie donnée.
  const result = validateProps({ email: 42, message: "1234567890" }, formSchema);

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.ok(result.errors.includes("email doit être un string, reçu number"));
});
