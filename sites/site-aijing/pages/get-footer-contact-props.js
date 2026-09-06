import { getProfil } from "../services/strapi-api.js";
import adaptProfileToFooterContact from "./adapt-profile-to-footer-contact.js";
import { footerContactCopy } from "./static-site-content.js";

export function getFooterContactPropsFromProfile(profile) {
  return adaptProfileToFooterContact(profile, footerContactCopy);
}

// The footer remains usable without Strapi; only social links are omitted.
export default async function getFooterContactProps() {
  try {
    const profile = await getProfil();
    return getFooterContactPropsFromProfile(profile);
  } catch (error) {
    console.error("Impossible de charger les liens sociaux Strapi.", error);
    return footerContactCopy;
  }
}
