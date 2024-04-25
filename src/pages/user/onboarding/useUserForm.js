import { useState } from "react";

export function useUserForm(PageDisplay) {
  const [page, setPage] = useState(0);

  function next() {
    setPage((i) => {
      if (i >= PageDisplay.length - 1) return 1;
      return i + 1;
    });
  }
  function back() {
    setPage((i) => {
      if (i <= 0) return 1;
      return i - 1;
    });
  }

  return {
    page,
    step: PageDisplay[page],
    isFirstStep: page === 0,
    isSecondStep: page===1,
    isLastStep: page === PageDisplay.length - 1,
    PageDisplay,
    next,
    back,
  };
}
