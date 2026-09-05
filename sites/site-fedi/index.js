import BrowserRouter from "./vanilla-engine/src/router/browser-router.js";
import routes from "./routes/index.js";
// PdfService (packages/vanilla-engine/src/pdf/) lit globalThis.html2pdf au
// moment de l'appel — chargé une seule fois ici, version figée (cf. README
// du module) pour éviter qu'une mise à jour silencieuse du CDN ne change
// de comportement sans qu'on s'en rende compte.
import html2pdf from "https://esm.run/html2pdf.js@0.14.0";

window.html2pdf = html2pdf;

const rootElement = document.getElementById("root");
BrowserRouter(rootElement, routes);