import HomePage from "../pages/home-page.js";
import Page404 from "../pages/not-found-page.js";
import AboutMePage from "../pages/about-me.js";
import ProjectsPage from "../pages/projects-page.js";
import ProjectDetailPage from "../pages/project-detail-page.js";


export default {
    "/": HomePage,
    "/about-me": AboutMePage,
    "/projects": ProjectsPage,
    "/projects/:slug": ProjectDetailPage,
    "*": Page404,
};
