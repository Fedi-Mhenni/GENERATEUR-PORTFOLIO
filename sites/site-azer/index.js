import BrowserRouter from "./vanilla-engine/src/router/browser-router.js";
import routes from "./routes/index.js";

const rootElement = document.getElementById("root");
BrowserRouter(rootElement, routes);
