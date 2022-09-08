/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:13:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 14:12:00
 * @Description: 请填写简介
 */
import { Button, Col, Form, Input, Row, Table } from 'antd'
import { columns } from './Columns'
import React, { useCallback, useState } from 'react'
import styles from '../index.module.css'

type Props = {
  participants: (Competition.Participant & { _id?: string })[]
}

function ParticipantsTable({ participants }: Props) {
  const [filteredParticipants, setFilteredParticipants] = useState<(Competition.Participant & { _id?: string })[]>(participants)
  const [searchParams, setSearchParams] = useState<{ username: string, email: string }>({ username: '', email: '' })

  const filter = useCallback((isReset?: boolean) => {
    if (!isReset) {
      setFilteredParticipants(() => {
        return participants.filter(participant => participant.username.includes(searchParams.username) && participant.email.includes(searchParams.email));
      })
    } else {
      setFilteredParticipants(participants)
    }
  }, [participants, searchParams.email, searchParams.username])

  return (
    <div className={styles['part-container']}>
      <div className={styles['part-title']}>
        参加者表格
      </div>

      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Row style={{ marginTop: '24px' }}>
          <Col span={8}>
            <Form.Item label={'用户名'}>
              <Input value={searchParams.username} placeholder='用户名' onChange={e => setSearchParams({ ...searchParams, username: e.target.value })} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'邮箱'}>
              <Input value={searchParams.email} placeholder='邮箱' onChange={e => setSearchParams({ ...searchParams, email: e.target.value })} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ position: 'relative' }}>
            <Button style={{ position: 'absolute', right: '100px', width: '90px' }}
              onClick={() => {
                setSearchParams({ username: '', email: '' });
                filter(true);
              }}
            >重置</Button>
            <Button type='primary' style={{ position: 'absolute', right: '0px', width: '90px' }} onClick={() => filter()}>搜索</Button>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={filteredParticipants}
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