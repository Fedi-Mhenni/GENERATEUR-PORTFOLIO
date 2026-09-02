import HomePage from "../pages/home-page.js";
import Page404 from "../pages/not-found-page.js";

export default {
  "/": HomePage,
  "*": Page404,
};
