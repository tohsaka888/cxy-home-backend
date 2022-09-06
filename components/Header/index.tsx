/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:23:08
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 16:30:53
 * @Description: 请填写简介
 */

import { Layout, Menu } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'

export const menuItems = [
  { label: '比赛模块', key: 'competition' },
  { label: '管理员模块', key: 'admin' },
  { label: '活动模块', key: 'activity' }
]

function Header() {
  const router = useRouter()
  const path = router.pathname.split('/')[1]
  const tokenRef = useRef<string>('')

  useEffect(() => {
    tokenRef.current = localStorage.getItem('token') || ''
  }, [])
  return (
    <Layout.Header>
      <Menu items={menuItems} mode={"horizontal"} theme={"dark"} defaultSelectedKeys={[path]}
        onClick={(info) => {
          router.push(`/${info.key}/${tokenRef.current}`)
        }}
      />
    </Layout.Header>
  )
}

export default Header
