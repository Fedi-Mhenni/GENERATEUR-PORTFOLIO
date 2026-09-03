import Sidebar from "../components/sidebar.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import { getProfil } from "../services/strapi-api.js";
import config from "../config.js";

const FALLBACK_INTRODUCTION =
  "Building modern, high-performing, and scalable web applications, from frontend to backend.";

function ctaLink(url, label, className) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", [className]]);
  return link;
}

function heroContent(profil) {
  if (!profil) {
    return [
      {
        type: "header",
        attributes: [["class", ["hero-intro"]]],
        children: [
          { type: "h1", children: ["Portfolio"] },
          {
            type: "p",
            attributes: [["class", ["hero-description"]]],
            children: ["Impossible de charger le profil pour le moment."],
          },
        ],
      },
    ];
  }

  const photoUrl = resolveImageUrl(profil.photo?.url, config.STRAPI_ORIGIN);

  return [
    {
      type: "header",
      attributes: [["class", ["hero-intro"]]],
      children: [
        ...(photoUrl
          ? [
              {
                type: "img",
                attributes: [
                  ["src", photoUrl],
                  ["alt", `Photo de profil de ${profil.prenom} ${profil.nom}`],
                  ["class", ["hero-photo"]],
                ],
              },
            ]
          : []),
        {
          type: "div",
          attributes: [["id", "cv-content"]],
          children: [
            { type: "h1", children: [`${profil.prenom} ${profil.nom}`] },
            ...(profil.poste
              ? [{ type: "p", attributes: [["class", ["hero-role"]]], children: [profil.poste] }]
              : []),
            {
              type: "p",
              attributes: [["class", ["hero-description"]]],
              children: [profil.introduction || FALLBACK_INTRODUCTION],
            },
          ],
        },
      ],
    },
    {
      type: "div",
      attributes: [["class", ["hero-actions"]]],
      children: [
        ctaLink("/projects", "View my projects", "btn-primary"),
        ctaLink("/contact", "Contact me!", "btn-secondary"),
      ],
    },
  ];
}

export default async function HomePage() {
  const profil = await getProfil();

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/"),
      {
        type: "main",
        attributes: [["class", ["hero"]]],
        children: heroContent(profil),
      },
    ],
  };
}
