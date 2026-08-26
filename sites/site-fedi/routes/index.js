import HomePage from "../pages/home-page.js";
import ProjetsPage from "../pages/projets-page.js";
import Page404 from "../pages/not-found-page.js";

export default {
  "/": HomePage,
  "/projets": ProjetsPage,
  "*": Page404,
};