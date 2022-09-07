/*
 * @Author: tohsaka888
 * @Date: 2022-09-07 11:18:07
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 16:13:21
 * @Description: 请填写简介
 */

import { competitionUrl } from 'config/baseUrl'
import React from 'react'
import useSWR from 'swr'

type Props = {
  way: string;
  id: string,
  onSuccess: (data: any, key: string) => void,
  onError?: (err: any, key: string) => void
}

function useCompetitionDetail({ way, id, onSuccess, onError }: Props) {
  const { data, error } = useSWR(way !== 'add' ? `${competitionUrl}/api/competition/${id}` : null, async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    return data
  }, {
    onSuccess: onSuccess,
    onError: onError || (() => { })
  })
  return { data, error }
}

export default useCompetitionDetail
