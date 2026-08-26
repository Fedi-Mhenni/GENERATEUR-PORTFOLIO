import { test } from "node:test";
import assert from "node:assert/strict";
import createStore from "../src/state/create-store.js";

test("getState() retourne l'état initial après création", () => {
  const store = createStore({ count: 0 });

  assert.deepEqual(store.getState(), { count: 0 });
});

test("setState(valeur directe) met à jour l'état, récupérable via getState()", () => {
  const store = createStore({ count: 0 });

  store.setState({ count: 1 });

  assert.deepEqual(store.getState(), { count: 1 });
});

test("setState(fn) applique la fonction sur l'état précédent", () => {
  const store = createStore({ count: 0 });

  store.setState((prevState) => ({ count: prevState.count + 1 }));

  assert.deepEqual(store.getState(), { count: 1 });
});

test("un subscriber reçoit le nouvel état (event.detail) après un setState", () => {
  const store = createStore({ count: 0 });
  let received;
  store.subscribe((state) => {
    received = state;
  });

  store.setState({ count: 5 });

  assert.deepEqual(received, { count: 5 });
});

test("plusieurs subscribers sont tous notifiés", () => {
  const store = createStore(0);
  let receivedByA;
  let receivedByB;
  store.subscribe((state) => {
    receivedByA = state;
  });
  store.subscribe((state) => {
    receivedByB = state;
  });

  store.setState(42);

  assert.equal(receivedByA, 42);
  assert.equal(receivedByB, 42);
});

test("après unsubscribe(), le callback n'est plus appelé sur les setState suivants", () => {
  const store = createStore(0);
  let callCount = 0;
  const unsubscribe = store.subscribe(() => {
    callCount++;
  });

  store.setState(1);
  unsubscribe();
  store.setState(2);
  store.setState(3);

  assert.equal(callCount, 1);
});
