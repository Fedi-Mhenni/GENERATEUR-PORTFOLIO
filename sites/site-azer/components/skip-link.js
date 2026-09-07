export default function SkipLink() {
  return {
    type: "a",
    attributes: [["href", "#main-content"], ["class", ["skip-link"]]],
    children: ["Skip to main content"],
  };
}
