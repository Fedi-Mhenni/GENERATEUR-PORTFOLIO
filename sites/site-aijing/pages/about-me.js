export default async function AboutMePage() {
  return {
    type: "main",
    attributes: [["class", ["page", "page--pending"]]],
    children: [
      { type: "h1", children: ["About"] },
      {
        type: "p",
        children: ["Cette page sera intégrée après Projects."],
      },
    ],
  };
}
