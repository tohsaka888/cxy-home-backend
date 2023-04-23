import React from "react";
import useSWR from "swr";

function useQuestionList() {
  return useSWR("questionList", async () => {
    const res = await fetch(`https://www.coder-home.top:8080/crud/all`);
    const data = await res.json();
    return data;
  });
}

export default useQuestionList;
