import { getProfil, getCompetences, getJourneys } from "../services/strapi-api.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import generatePdf from "../vanilla-engine/src/pdf/index.js";
import config from "../config.js";

// Lien externe (média Strapi) : même raison qu'ailleurs (home-page.js,
// footer.js) — pushState refuse une URL cross-origin.
function externalLink(url, label, classNames) {
  return {
    type: "a",
    attributes: [
      ["href", url],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
      ["class", classNames],
    ],
    children: [label],
  };
}

// Exporte le contenu de la page (hors Navbar/Footer, non pertinents figés
// dans un PDF) : .about porte tout ce qui représente réellement "mon
// portfolio" — bio, compétences, parcours.
async function handleExportPdf() {
  const feedback = document.querySelector("[data-pdf-feedback]");
  feedback.textContent = "";
  feedback.className = "about__pdf-feedback";

  const cible = document.querySelector(".about");
  const { success, errors } = await generatePdf(cible, { filename: "portfolio-fedi-mhenni.pdf" });

  if (!success) {
    feedback.textContent = errors?.[0] ?? "Échec de l'export PDF, réessaie plus tard.";
    feedback.className = "about__pdf-feedback about__pdf-feedback--error";
  }
}

// Groupe les compétences par categorie (accordéon "What I do" de la maquette
// Figma) — entièrement dérivé des vraies données, aucune catégorie en dur :
// la maquette montre des catégories d'exemple qui ne correspondent pas
// forcément aux vraies valeurs "categorie" saisies dans Strapi.
function groupByCategorie(competences) {
  const groupes = new Map();
  for (const competence of competences) {
    const categorie = competence.categorie || "Autres";
    if (!groupes.has(categorie)) groupes.set(categorie, []);
    groupes.get(categorie).push(competence.nom);
  }
  return [...groupes.entries()];
}

// "2025-2026" ou "2025" si une seule des deux dates est renseignée.
function formatPeriode(dateDebut, dateFin) {
  const anneeDebut = dateDebut ? new Date(dateDebut).getFullYear() : null;
  const anneeFin = dateFin ? new Date(dateFin).getFullYear() : null;
  if (anneeDebut && anneeFin && anneeDebut !== anneeFin) return `${anneeDebut}-${anneeFin}`;
  return `${anneeDebut ?? anneeFin ?? ""}`;
}

// Certaines valeurs saisies dans Strapi trainent déjà une virgule ("cursus"
// terminé par ",") — on la retire avant de rejoindre, sinon on affiche une
// double virgule ("Bachelor's degree,, École"). Défensif côté code plutôt
// que de compter sur une saisie toujours propre.
function formatDetail(cursus, ecole, ville) {
  return [cursus, ecole, ville]
    .filter(Boolean)
    .map((valeur) => valeur.trim().replace(/,+$/, ""))
    .join(", ");
}

export default async function AboutPage() {
  const profilData = await getProfil();
  const profil = profilData?.attributes ?? profilData;
  const competences = await getCompetences();
  const journeys = await getJourneys();
  const footer = await Footer();

  return {
    type: "div",
    attributes: [["class", ["page"]]],
    children: [
      Navbar(),
      {
        type: "main",
        attributes: [["class", ["container", "about"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["about__intro"]]],
            children: [
              { type: "h1", attributes: [["class", ["about__title"]]], children: ["About me"] },
              {
                type: "p",
                attributes: [["class", ["about__bio"]]],
                children: [profil?.biographie ?? "Profil non renseigné."],
              },
              {
                type: "div",
                attributes: [["class", ["about__actions"]]],
                children: [
                  ...(profil?.cv
                    ? [
                        externalLink(
                          resolveImageUrl(profil.cv.url, config.STRAPI_ORIGIN),
                          "Télécharger le CV",
                          ["btn", "btn--secondary"],
                        ),
                      ]
                    : []),
                  {
                    type: "button",
                    attributes: [["type", "button"], ["class", ["btn", "btn--secondary"]]],
                    events: [["click", handleExportPdf]],
                    children: ["Exporter mon portfolio en PDF"],
                  },
                ],
              },
              {
                type: "p",
                attributes: [["class", ["about__pdf-feedback"]], ["data-pdf-feedback", "true"]],
                children: [""],
              },
            ],
          },
          {
            type: "section",
            attributes: [["class", ["about__section"]]],
            children: [
              { type: "h2", attributes: [["class", ["about__subtitle"]]], children: ["What I do"] },
              competences.length > 0
                ? {
                    type: "div",
                    attributes: [["class", ["about__accordion"]]],
                    children: groupByCategorie(competences).map(([categorie, noms]) => ({
                      type: "details",
                      attributes: [["class", ["about__accordion-item"]]],
                      children: [
                        {
                          type: "summary",
                          attributes: [["class", ["about__accordion-title"]]],
                          children: [categorie],
                        },
                        {
                          type: "ul",
                          attributes: [["class", ["about__accordion-list"]]],
                          children: noms.map((nom) => ({
                            type: "li",
                            attributes: [["class", ["about__accordion-skill"]]],
                            children: [nom],
                          })),
                        },
                      ],
                    })),
                  }
                : { type: "p", attributes: [["class", ["about__empty"]]], children: ["Aucune compétence renseignée"] },
              {
                type: "p",
                attributes: [["class", ["about__tagline"]]],
                children: ["Passionate about continuous learning & new technologies."],
              },
            ],
          },
          {
            type: "section",
            attributes: [["class", ["about__section"]]],
            children: [
              { type: "h2", attributes: [["class", ["about__subtitle"]]], children: ["My Journey"] },
              journeys.length > 0
                ? {
                    type: "ul",
                    attributes: [["class", ["about__timeline"]]],
                    children: journeys.map((journey) => ({
                      type: "li",
                      attributes: [["class", ["about__timeline-item"]]],
                      children: [
                        { type: "span", attributes: [["class", ["about__timeline-marker"]]] },
                        {
                          type: "div",
                          attributes: [["class", ["about__timeline-body"]]],
                          children: [
                            {
                              type: "span",
                              attributes: [["class", ["about__timeline-year"]]],
                              children: [formatPeriode(journey.date_debut, journey.date_fin)],
                            },
                            {
                              type: "p",
                              attributes: [["class", ["about__timeline-detail"]]],
                              children: [formatDetail(journey.cursus, journey.ecole, journey.ville)],
                            },
                          ],
                        },
                      ],
                    })),
                  }
                : { type: "p", attributes: [["class", ["about__empty"]]], children: ["Aucun parcours renseigné"] },
            ],
          },
        ],
      },
      footer,
    ],
  };
}
