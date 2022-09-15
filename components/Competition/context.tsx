/*
 * @Author: tohsaka888
 * @Date: 2022-09-15 08:45:51
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 08:46:53
 * @Description: 请填写简介
 */

import { createContext } from "react";

type LoadingContextProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingContextProps | null>(null)