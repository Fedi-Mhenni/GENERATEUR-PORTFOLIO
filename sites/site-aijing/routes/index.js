import HomePage from "../pages/home-page.js";
import Page404 from "../pages/not-found-page.js";
import AboutMePage from "../pages/about-me.js";
import ProjectsPage from "../pages/projects-page.js";
import ProjectDetailPage from "../pages/project-detail-page.js";
import PrivacyPage from "../pages/privacy-page.js";
import { pathFor, setLocale } from "../i18n/index.js";

function localized(Page, locale) {
  return (params = {}) => {
    setLocale(locale);
    return Page({ ...params, locale });
  };
}

function legacyRedirect(Page, locale, page) {
  return (params = {}) => {
    const target = pathFor(locale, page, params);
    window.history.replaceState({}, "", `${target}${window.location.search}`);
    setLocale(locale);
    return Page({ ...params, locale });
  };
}

export default {
    "/en": localized(HomePage, "en"),
    "/en/about-me": localized(AboutMePage, "en"),
    "/en/projects": localized(ProjectsPage, "en"),
    "/en/projects/:slug": localized(ProjectDetailPage, "en"),
    "/en/privacy-policy": localized(PrivacyPage, "en"),
    "/fr": localized(HomePage, "fr"),
    "/fr/a-propos": localized(AboutMePage, "fr"),
    "/fr/projets": localized(ProjectsPage, "fr"),
    "/fr/projets/:slug": localized(ProjectDetailPage, "fr"),
    "/fr/politique-de-confidentialite": localized(PrivacyPage, "fr"),
    "/": legacyRedirect(HomePage, "en", "home"),
    "/about-me": legacyRedirect(AboutMePage, "en", "about"),
    "/projects": legacyRedirect(ProjectsPage, "en", "projects"),
    "/projects/:slug": legacyRedirect(ProjectDetailPage, "en", "project"),
    "/privacy-page": legacyRedirect(PrivacyPage, "en", "privacy"),
    "*": localized(Page404, "en"),
};
