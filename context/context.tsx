/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 14:35:10
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 14:38:59
 * @Description: 请填写简介
 */

import React, { createContext } from "react";

type Props = {
  competition: Competition.Competition | null;
  setCompetition: React.Dispatch<React.SetStateAction<Competition.Competition | null>>
}

export const CompetitionContext = createContext<Props | null>(null)
