import { getProfil } from "../services/strapi-api.js";
import adaptProfileToFooterContact from "./adapt-profile-to-footer-contact.js";
import { footerContactCopy } from "./static-site-content.js";

// The footer remains usable without Strapi; only social links are omitted.
export default async function getFooterContactProps() {
  try {
    const profile = await getProfil();
    return adaptProfileToFooterContact(profile, footerContactCopy);
  } catch (error) {
    console.error("Impossible de charger les liens sociaux Strapi.", error);
    return footerContactCopy;
  }
}
