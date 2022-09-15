/*
 * @Author: tohsaka888
 * @Date: 2022-09-15 10:46:35
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 10:51:37
 * @Description: 请填写简介
 */

import React, { createContext } from "react";
import { Activity } from "typings/activity";

export const ActivityContext = createContext<{
  activity: Activity.Activity & { _id: string }
  setActivity: React.Dispatch<React.SetStateAction<Activity.Activity & { _id: string }>>
} | null>(null)