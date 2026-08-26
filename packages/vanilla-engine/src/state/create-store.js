export default function createStore(initialState) {
  let state = initialState;
  const eventTarget = new EventTarget();

  function getState() {
    return state;
  }

  function setState(update) {
    state = typeof update === "function" ? update(state) : update;
    eventTarget.dispatchEvent(new CustomEvent("change", { detail: state }));
  }

  function subscribe(callback) {
    function listener(event) {
      callback(event.detail);
    }
    eventTarget.addEventListener("change", listener);
    return function unsubscribe() {
      eventTarget.removeEventListener("change", listener);
    };
  }

  return { getState, setState, subscribe };
}
