import HomePage from "../pages/home-page.js";
import AboutPage from "../pages/about-page.js";
import ProjetsPage from "../pages/projets-page.js";
import ProjetDetailPage from "../pages/projet-detail-page.js";
import ContactPage from "../pages/contact-page.js";
import Page404 from "../pages/not-found-page.js";

export default {
  "/": HomePage,
  "/about": AboutPage,
  "/projects": ProjetsPage,
  "/projects/:slug": ProjetDetailPage,
  "/contact": ContactPage,
  "*": Page404,
};
