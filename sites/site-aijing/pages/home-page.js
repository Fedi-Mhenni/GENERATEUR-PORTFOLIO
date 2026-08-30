import config from "../config.js";
import {
  getCompetences,
  getExperiences,
  getJourneys,
  getProfil,
  getProjets,
} from "../services/strapi-api.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";

function fields(entry) {
  return entry?.attributes ?? entry ?? {};
}

function text(value, fallback = "Non renseigné") {
  return value || fallback;
}

function listSection(title, entries, renderEntry) {
  return {
    type: "section",
    attributes: [["class", ["content-section"]]],
    children: [
      { type: "h2", children: [title] },
      entries.length === 0
        ? { type: "p", children: ["Aucun contenu publié pour le moment."] }
        : {
            type: "ul",
            attributes: [["class", ["content-list"]]],
            children: entries.map(renderEntry),
          },
    ],
  };
}

function profileHeader(profil) {
  const data = fields(profil);
  const photo = fields(data.photo).url;
  const links = [
    data.linkedin && ["LinkedIn", data.linkedin],
    data.github && ["GitHub", data.github],
    data.email && ["Email", `mailto:${data.email}`],
  ].filter(Boolean);

  if (!profil) {
    return {
      type: "header",
      attributes: [["class", ["profile-header"]]],
      children: [
        { type: "h1", children: ["Portfolio Aijing"] },
        {
          type: "p",
          children: ["Ajoute et renseigne le single type Profil dans Strapi."],
        },
      ],
    };
  }

  return {
    type: "header",
    attributes: [["class", ["profile-header"]]],
    children: [
      ...(photo
        ? [
            {
              type: "img",
              attributes: [
                ["class", ["profile-photo"]],
                ["src", resolveImageUrl(photo, config.API_ORIGIN)],
                ["alt", `${data.prenom} ${data.nom}`],
              ],
            },
          ]
        : []),
      { type: "h1", children: [`${text(data.prenom, "")} ${text(data.nom, "")}`.trim()] },
      { type: "p", attributes: [["class", ["profile-role"]]], children: [text(data.poste)] },
      ...(data.ecole ? [{ type: "p", children: [data.ecole] }] : []),
      ...(data.introduction ? [{ type: "p", children: [data.introduction] }] : []),
      ...(data.biographie ? [{ type: "p", children: [data.biographie] }] : []),
      ...(links.length
        ? [
            {
              type: "nav",
              attributes: [["class", ["profile-links"]]],
              children: links.map(([label, href]) => ({
                type: "a",
                attributes: [
                  ["href", href],
                  ["target", href.startsWith("http") ? "_blank" : "_self"],
                  ["rel", href.startsWith("http") ? "noopener noreferrer" : ""],
                ],
                children: [label],
              })),
            },
          ]
        : []),
    ],
  };
}

export default async function HomePage() {
  try {
    const [profil, projets, experiences, competences, journeys] = await Promise.all([
      getProfil(),
      getProjets(),
      getExperiences(),
      getCompetences(),
      getJourneys(),
    ]);

    return {
      type: "div",
      attributes: [["class", ["page"]]],
      children: [
        profileHeader(profil),
        listSection("Projets", projets, (entry) => {
          const data = fields(entry);
          return {
            type: "li",
            children: [
              { type: "h3", children: [text(data.titre)] },
              ...(data.soustitre ? [{ type: "p", children: [data.soustitre] }] : []),
              ...(data.description ? [{ type: "p", children: [data.description] }] : []),
            ],
          };
        }),
        listSection("Expériences", experiences, (entry) => {
          const data = fields(entry);
          return {
            type: "li",
            children: [
              { type: "h3", children: [text(data.intitule)] },
              { type: "p", children: [text(data.entreprise)] },
              {
                type: "p",
                children: [`${text(data.dateDebut, "?")} — ${text(data.dateFin, "Aujourd’hui")}`],
              },
              ...(data.description ? [{ type: "p", children: [data.description] }] : []),
            ],
          };
        }),
        listSection("Compétences", competences, (entry) => {
          const data = fields(entry);
          return {
            type: "li",
            children: [text(data.nom), ...(data.categorie ? [` — ${data.categorie}`] : [])],
          };
        }),
        listSection("Parcours", journeys, (entry) => {
          const data = fields(entry);
          return {
            type: "li",
            children: [
              { type: "h3", children: [text(data.cursus)] },
              { type: "p", children: [text(data.ecole)] },
              {
                type: "p",
                children: [`${text(data.date_debut, "?")} — ${text(data.date_fin, "Aujourd’hui")}`],
              },
              ...(data.ville || data.pays
                ? [{ type: "p", children: [[data.ville, data.pays].filter(Boolean).join(", ")] }]
                : []),
            ],
          };
        }),
      ],
    };
  } catch (error) {
    return {
      type: "section",
      attributes: [["class", ["page", "error"]]],
      children: [
        { type: "h1", children: ["Impossible de charger le portfolio"] },
        { type: "p", children: [error.message] },
        {
          type: "p",
          children: [
            "Vérifie que Strapi est démarré et que les permissions publiques de chaque type de contenu autorisent find.",
          ],
        },
      ],
    };
  }
}
