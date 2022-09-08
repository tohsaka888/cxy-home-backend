/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:21:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 17:00:50
 * @Description: 请填写简介
 */

import { CompetitionContext } from "context/context"
import { useCallback, useContext } from "react"
import { Popconfirm } from 'antd'

const Operation = ({ record }: { record: any }) => {
  const { competition, setCompetition } = useContext(CompetitionContext)!

  const deleteItem = useCallback(() => {
    if (competition) {
      const newWinners = competition?.winners.filter(win => win.username !== record.username)
      setCompetition({ ...competition, winners: newWinners })
    }
  }, [competition, record.username, setCompetition])

  return (
    <>
      <Popconfirm okText={"确认"} cancelText={"取消"} onConfirm={deleteItem} title={'确认删除,删除后无法恢复'}>
        <a>删除</a>
      </Popconfirm>
    </>
  )
}

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render(text: any, record: any, index: number) {
      return index + 1
    }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email'
  },
  {
    title: '奖项',
    key: 'award',
    dataIndex: 'award'
  },
  {
    title: '操作',
    key: 'operation',
    render(text: any, record: any) {
      return <Operation record={record} />
    }
  }
]
