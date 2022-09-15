/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:17:45
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 09:26:50
 * @Description: 请填写简介
 */

import { Layout } from 'antd'
import ActivityList from 'components/Activity/ActivityList'
import React from 'react'
import Header from '../../components/Header'

function Activity() {
  return (
    <Layout>
      <Header />
      <ActivityList />
    </Layout>
  )
}

export default Activity