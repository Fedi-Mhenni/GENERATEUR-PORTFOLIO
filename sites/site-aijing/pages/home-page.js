import config from "../config.js";
import {
  getCompetences,
  getExperiences,
  getJourneys,
  getProfil,
  getProjets,
} from "../services/strapi-api.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";


export default async function HomePage() {
  return {
    type: "main",
    attributes: [["class", ["page", "page--pending"]]],
    children: [
      { type: "h1", children: ["Home"] },
      {
        type: "p",
        children: ["Cette page sera intégrée après Projects."],
      },
    ],
  };
}
