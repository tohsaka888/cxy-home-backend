/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 15:59:22
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 16:10:24
 * @Description: 请填写简介
 */

import React from "react";
import useSWR from "swr";
import { loginUrl } from "../config/baseUrl";

export const loginFetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: localStorage.getItem("token") || "" }),
    mode: "cors",
  });
  const data = await res.json();
  return data;
};

function useLoginStatus() {
  const { data, error } = useSWR(`${loginUrl}/api/login/status`, loginFetcher);

  return { data, error };
}

export default useLoginStatus;
