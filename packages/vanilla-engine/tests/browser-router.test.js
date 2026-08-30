import { test } from "node:test";
import assert from "node:assert/strict";
import { matchRoute } from "../src/router/browser-router.js";

function Home() {}
function ProjetDetail() {}
function NotFound() {}

const routes = {
  "/": Home,
  "/projets/:slug": ProjetDetail,
  "*": NotFound,
};

test("un pattern statique simple matche bien", () => {
  const { generator, params } = matchRoute(routes, "/");

  assert.equal(generator, Home);
  assert.deepEqual(params, {});
});

test("un pattern avec :param capture la bonne valeur trouvée dans l'URL", () => {
  const { generator, params } = matchRoute(routes, "/projets/mon-slug");

  assert.equal(generator, ProjetDetail);
  assert.deepEqual(params, { slug: "mon-slug" });
});

test("un pattern qui ne correspond à rien retombe sur la route '*'", () => {
  const { generator, params } = matchRoute(routes, "/une/url/totalement/inconnue");

  assert.equal(generator, NotFound);
  assert.deepEqual(params, {});
});
