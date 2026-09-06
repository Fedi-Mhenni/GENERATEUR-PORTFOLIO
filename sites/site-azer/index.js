import html2pdf from "https://esm.run/html2pdf.js@0.14.0";
import BrowserRouter from "./vanilla-engine/src/router/browser-router.js";
import routes from "./routes/index.js";

window.html2pdf = html2pdf;

const rootElement = document.getElementById("root");
BrowserRouter(rootElement, routes);
