import config from "../config.js";
import {
    getCompetences,
    getExperiences,
    getJourneys,
    getProfil,
} from "../services/strapi-api.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";


export default async function AboutMePage() {
  return {
    type: "main",
    attributes: [["class", ["page", "page--pending"]]],
    children: [
      { type: "h1", children: ["About"] },
      {
        type: "p",
        children: ["Cette page sera intégrée après Projects."],
      },
    ],
  };
}
