import getCvUrl from "../vanilla-engine/src/utils/get-cv-url.js";
import config from "../config.js";

export default function CvLink(profil, classNames) {
  const url = getCvUrl(profil, config.STRAPI_ORIGIN);
  if (!url) {
    return null;
  }

  return {
    type: "a",
    attributes: [
      ["href", url],
      ["download", ""],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
      ["class", classNames],
    ],
    children: [
      { type: "span", attributes: [["class", ["icon", "icon-download"]]] },
      { type: "span", children: ["Download CV"] },
    ],
  };
}
