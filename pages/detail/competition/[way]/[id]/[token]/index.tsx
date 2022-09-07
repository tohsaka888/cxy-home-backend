/*
 * @Author: tohsaka888
 * @Date: 2022-09-07 10:59:40
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 16:01:06
 * @Description: 请填写简介
 */

import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { competitionUrl } from 'config/baseUrl'
import { SWRConfig } from 'swr'
import CompetitionDetail from 'components/Detail/Competition/CompetitionDetail'

const Detail: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig value={fallback}>
      <CompetitionDetail />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query
  const res = await fetch(`${competitionUrl}/api/competition/${id}`)
  const data = await res.json()
  return {
    props: {
      fallback: {
        [`${competitionUrl}/api/competition/${id}`]: data
      }
    }
  }
}

export default Detail