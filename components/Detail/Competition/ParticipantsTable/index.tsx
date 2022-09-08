/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:13:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 10:27:21
 * @Description: 请填写简介
 */
import { Table } from 'antd'
import { columns } from './Columns'
import React from 'react'
import styles from '../index.module.css'

type Props = {
  participants: (Competition.Participant & { _id?: string })[]
}

function ParticipantsTable({ participants }: Props) {
  return (
    <div className={styles['part-container']}>
      <div className={styles['part-title']}>
        参加者表格
      </div>
      <Table
        style={{marginTop: '8px'}}
        dataSource={participants}
        rowKey={record => record._id || record.username}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showPrevNextJumpers: true
        }}
      />
    </div>
  )
}

export default ParticipantsTable