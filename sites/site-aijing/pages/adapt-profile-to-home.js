import config from "../config.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function preferredImage(image) {
  return image?.formats?.large ?? image ?? null;
}

export default function adaptProfileToHome(profile, fallback) {
  const normalizedProfile = profile?.attributes ?? profile ?? {};
  const fullName = [
    nonEmptyString(normalizedProfile.prenom),
    nonEmptyString(normalizedProfile.nom),
  ].filter(Boolean).join(" ");
  const photo = preferredImage(normalizedProfile.photo);
  const photoSrc = resolveImageUrl(photo?.url, config.API_ORIGIN);

  return {
    title: fullName || fallback.heroTitle,
    introduction:
      nonEmptyString(normalizedProfile.introduction) || fallback.heroIntroduction,
    photoSrc: photoSrc || "/assets/images/profil.png",
    photoAlt: "Illustrated portrait of Aijing Li",
    photoWidth: photo?.width || 679,
    photoHeight: photo?.height || 839,
  };
}
