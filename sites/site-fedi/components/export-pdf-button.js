import generatePdf from "../vanilla-engine/src/pdf/index.js";

// Cible le contenu réel de LA page courante (pas "tout le portfolio" —
// export honnête de ce qui est réellement affiché), via la classe commune
// .page__content posée sur le conteneur principal de chaque page (voir
// home-page.js/about-page.js/projets-page.js). Hors Navbar/Footer,
// non pertinents figés dans un PDF.
async function handleExportPdf() {
  const feedback = document.querySelector("[data-pdf-feedback]");
  feedback.textContent = "";
  feedback.className = "page-pdf-export__feedback";

  const cible = document.querySelector(".page__content");
  const nomFichier = (window.location.pathname.replace(/\//g, "") || "home") + ".pdf";
  const { success, errors } = await generatePdf(cible, { filename: nomFichier });

  if (!success) {
    feedback.textContent = errors?.[0] ?? "Échec de l'export PDF, réessaie plus tard.";
    feedback.className = "page-pdf-export__feedback page-pdf-export__feedback--error";
  }
}

// Composant partagé entre toutes les pages de site-fedi (comme Navbar/Footer)
// : un bouton discret, à droite, juste sous la navbar sur chaque page.
export default function ExportPdfButton() {
  return {
    type: "div",
    attributes: [["class", ["page-pdf-export"]]],
    children: [
      {
        type: "button",
        attributes: [["type", "button"], ["class", ["btn", "btn--secondary", "page-pdf-export__button"]]],
        events: [["click", handleExportPdf]],
        children: ["Export this page on PDF"],
      },
      {
        type: "p",
        attributes: [["class", ["page-pdf-export__feedback"]], ["data-pdf-feedback", "true"]],
        children: [""],
      },
    ],
  };
}
