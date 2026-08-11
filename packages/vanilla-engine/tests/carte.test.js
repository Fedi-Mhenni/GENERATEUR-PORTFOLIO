import { test } from "node:test";
import assert from "node:assert/strict";
import Carte from "../src/components/carte.js";

function findChild(structure, type) {
  return structure.children.find((child) => child.type === type);
}

function getAttribute(structure, name) {
  const found = structure.attributes?.find(([key]) => key === name);
  return found ? found[1] : undefined;
}

test("props valides complètes -> structure div avec le bon type et les bonnes valeurs", () => {
  const structure = Carte({
    titre: "Mon projet",
    image: "/img.png",
    description: "Une description",
    lien: "/projets/mon-projet",
  });

  assert.equal(structure.type, "div");

  const image = findChild(structure, "img");
  assert.equal(getAttribute(image, "src"), "/img.png");
  assert.equal(getAttribute(image, "alt"), "Mon projet");

  const titre = findChild(structure, "h2");
  assert.deepEqual(titre.children, ["Mon projet"]);

  const description = findChild(structure, "p");
  assert.deepEqual(description.children, ["Une description"]);

  const lien = findChild(structure, "a");
  assert.equal(getAttribute(lien, "href"), "/projets/mon-projet");
  assert.deepEqual(lien.children, ["Voir le projet"]);
});

test("titre manquant (required) -> log une erreur via console.error, mais retourne quand même une structure", () => {
  const originalConsoleError = console.error;
  const calls = [];
  console.error = (...args) => calls.push(args);

  let structure;
  try {
    structure = Carte({ lien: "/projets/x" });
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(calls.length, 1);
  assert.equal(structure.type, "div");
});

test("image/description absentes -> valeurs par défaut '' utilisées, pas de crash", () => {
  const structure = Carte({ titre: "Sans image", lien: "/projets/y" });

  const image = findChild(structure, "img");
  assert.equal(getAttribute(image, "src"), "");

  const description = findChild(structure, "p");
  assert.deepEqual(description.children, [""]);
});

test("le lien passé est bien utilisé dans le BrowserLink retourné (attribut href)", () => {
  const structure = Carte({
    titre: "Projet",
    lien: "/projets/mon-slug",
  });

  const lien = findChild(structure, "a");
  assert.equal(getAttribute(lien, "href"), "/projets/mon-slug");
});
