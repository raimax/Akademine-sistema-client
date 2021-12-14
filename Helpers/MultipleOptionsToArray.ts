import { RefObject } from "react";

export default function MultipleOptionsToArray(
  ref: RefObject<HTMLSelectElement>,
  action: string
) {
  let options: number[] = [];

  const ffe = Array.from(
    ref.current?.selectedOptions as HTMLCollectionOf<HTMLOptionElement>
  );

  if (action === "remove") {
    ffe.filter((value) => {
      if (value.getAttribute("data-group-subject-id") !== null) {
        options.push(Number(value.getAttribute("data-group-subject-id")));
      }
    });
  } else if (action == "assign") {
    ffe.filter((value) => {
      if (value.getAttribute("value") !== null) {
        options.push(Number(value.getAttribute("value")));
      }
    });
  }

  return options;
}
