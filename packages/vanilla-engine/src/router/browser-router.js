import generateStructure from "../core/generate-structure.js";

export function matchRoute(routes, pathname) {
  const pathParts = pathname.split("/");

  for (const pattern in routes) {
    if (pattern === "*") {
      continue;
    }

    const patternParts = pattern.split("/");
    if (patternParts.length !== pathParts.length) {
      continue;
    }

    const params = {};
    const isMatch = patternParts.every((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = pathParts[i];
        return true;
      }
      return part === pathParts[i];
    });

    if (isMatch) {
      return { generator: routes[pattern], params };
    }
  }

  return { generator: routes["*"], params: {} };
}

export default function BrowserRouter(rootElement, routes) {
  async function refreshPage() {
    const pathname = window.location.pathname;
    const { generator, params } = matchRoute(routes, pathname);
    const structure = await generator(params);

    if (rootElement.childNodes[0]) {
      rootElement.replaceChild(
        generateStructure(structure),
        rootElement.childNodes[0],
      );
    } else {
      rootElement.appendChild(generateStructure(structure));
    }
  }
  window.addEventListener("popstate", refreshPage);
  window.addEventListener("pushstate", refreshPage);
  refreshPage();
}

export function BrowserLink(url, title) {
  return {
    type: "a",
    attributes: [["href", url]],
    children: [title],
    events: [
      [
        "click",
        (event) => {
          event.preventDefault();
          window.history.pushState({}, undefined, url);
          window.dispatchEvent(new Event("pushstate"));
        },
      ],
    ],
  };
}