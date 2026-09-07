import en from "./en.js";
import fr from "./fr.js";

const dictionaries = { en, fr };
let currentLocale = "en";

export function getTranslations(locale = currentLocale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale) {
  currentLocale = dictionaries[locale] ? locale : "en";

  if (typeof document !== "undefined") {
    const dictionary = getTranslations();
    document.documentElement.lang = currentLocale;
    document.title = dictionary.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", dictionary.meta.description);
  }
}

export function t(key, locale = currentLocale) {
  return key.split(".").reduce(
    (value, part) => value?.[part],
    getTranslations(locale),
  ) ?? key;
}

export function pathFor(locale, page, params = {}) {
  let path = getTranslations(locale).routes[page] ?? getTranslations("en").routes[page];

  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  });

  return path;
}
