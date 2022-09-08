/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:33:06
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 10:41:53
 * @Description: 请填写简介
 */

import { Table } from 'antd';
import React from 'react'
import styles from '../index.module.css'
import { columns } from './Columns';

type Props = {
  participants: (Competition.Participant & { _id?: string })[];
  winners: (Competition.Winner & { _id?: string })[];
}

function AwardTable({ participants, winners }: Props) {
  return (
    <div className={styles['part-container']}>
      <div className={styles['part-title']}>获奖名单表格</div>
      <Table
        style={{ marginTop: '8px' }}
        dataSource={winners}
        columns={columns}
        rowKey={record => record._id || record.username}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showPrevNextJumpers: true
        }}
      />
    </div>
  )
}

export default AwardTable
