import { loginUrl } from "config/baseUrl";
import React, { useMemo } from "react";
import useSWR from "swr";

function useAdminList() {
  const getAdminList = async (url: string) => {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  };
  const { data, error, mutate } = useSWR(
    `${loginUrl}/api/admin/list`,
    getAdminList
  );

  const list = useMemo(() => {
    if (data) {
      return data.list;
    } else {
      return [];
    }
  }, [data]);

  return { list, error, loading: !error && !data, mutate };
}

export default useAdminList;
