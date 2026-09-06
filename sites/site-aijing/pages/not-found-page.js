export default function Page404() {
  return {
    type: "main",
    attributes: [["class", ["page"]]],
    children: [
      { type: "h1", children: ["Page introuvable"] },
      { type: "p", children: ["Cette page n'existe pas."] },
    ],
  };
}
