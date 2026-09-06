import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import Button from "./button.js";

const schema = {
  currentPage: { type: "number", required: true },
  totalPages: { type: "number", required: true },
  onPageChange: { type: "function", required: true },
  previousLabel: { type: "string", required: false, default: "Previous" },
  nextLabel: { type: "string", required: false, default: "Next" },
};

function paginationIsValid(props) {
  return (
    Number.isInteger(props.currentPage) &&
    Number.isInteger(props.totalPages) &&
    props.currentPage >= 1 &&
    props.totalPages >= 1 &&
    props.currentPage <= props.totalPages
  );
}

function paginationButton({ label, disabled, onClick }) {
  const button = Button({ label, type: "button", disabled, onClick });
  button.attributes[0][1].push("archive-pagination__control");
  return button;
}

export default function ArchivePagination(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid || !paginationIsValid(finalProps)) {
    console.error(
      "ArchivePagination: props invalides —",
      [...errors, "pages incohérentes"].join(", "),
    );
    return {
      type: "p",
      attributes: [["class", ["archive-pagination__invalid"]]],
      children: ["Pagination indisponible."],
    };
  }

  const isFirstPage = finalProps.currentPage === 1;
  const isLastPage = finalProps.currentPage === finalProps.totalPages;

  return {
    type: "nav",
    attributes: [
      ["class", ["archive-pagination"]],
      ["aria-label", "Pagination des projets"],
    ],
    children: [
      paginationButton({
        label: finalProps.previousLabel ?? "Previous",
        disabled: isFirstPage,
        onClick: () => finalProps.onPageChange(finalProps.currentPage - 1),
      }),
      {
        type: "span",
        attributes: [
          ["class", ["archive-pagination__status", "type-label"]],
          ["aria-current", "page"],
        ],
        children: [`${finalProps.currentPage} / ${finalProps.totalPages}`],
      },
      paginationButton({
        label: finalProps.nextLabel ?? "Next",
        disabled: isLastPage,
        onClick: () => finalProps.onPageChange(finalProps.currentPage + 1),
      }),
    ],
  };
}
