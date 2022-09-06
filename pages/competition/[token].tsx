/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:17:20
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 17:15:49
 * @Description: 请填写简介
 */

import { Layout } from 'antd'
import React from 'react'
import CompetitionList from '../../components/Competition'
import Header from '../../components/Header'

function Competition() {
  return (
    <Layout>
      <Header />
      <Layout>
        <Layout.Content
          style={{
            minHeight: 'calc(100vh - 65px)',
            width: '70vw',
            marginLeft: '15vw'
          }}
        >
          <CompetitionList />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Competition
