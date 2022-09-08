/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:33:06
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 16:41:36
 * @Description: 请填写简介
 */

import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { CompetitionContext } from 'context/context';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styles from '../index.module.css'
import { columns } from './Columns';
import { columns as pColumns } from '../ParticipantsTable/Columns'

type Props = {
  participants: (Competition.Participant & { _id?: string })[];
  winners: (Competition.Winner & { _id?: string })[];
}

export const items = [
  { label: '一等奖', value: '一等奖' },
  { label: '二等奖', value: '二等奖' },
  { label: '三等奖', value: '三等奖' },
  { label: '优秀奖', value: '优秀奖' }
]

function AwardTable({ participants, winners }: Props) {
  const [filteredWinners, setFilteredWinners] = useState<(Competition.Winner & { _id?: string })[]>(winners)
  const [searchParams, setSearchParams] = useState<{ username: string; email: string; award: string; }>({ username: '', email: '', award: '' })
  const { setCompetition, competition } = useContext(CompetitionContext)!
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchAddParams, setSearchAddParams] = useState<{ username: string; email: string; award: string; }>({ username: '', email: '', award: '' })
  const [visible, setVisible] = useState<boolean>(false)
  const [form] = Form.useForm()
  const router = useRouter()
  const { way } = router.query

  const filter = useCallback((isReset?: boolean) => {
    if (!isReset) {
      setFilteredWinners(() => {
        return winners.filter(winner => winner.username.includes(searchParams.username) && winner.email.includes(searchParams.email) && winner.award.includes(searchParams.award))
      })
    } else {
      setFilteredWinners(winners)
    }
  }, [searchParams.award, searchParams.email, searchParams.username, winners])

  const canAddList = useMemo(() => {
    return (
      participants
        .filter((participant) => !winners.find(winner => winner.username === participant.username))
        .filter((winner) => winner.username.includes(searchAddParams.username) && winner.email.includes(searchAddParams.email))
    )
  }, [participants, winners, searchAddParams])

  useEffect(() => {
    filter()
  }, [competition, filter])

  return (
    <div className={styles['part-container']}>
      <div className={styles['part-title']}>获奖名单表格</div>

      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        <Row style={{ marginTop: '24px' }}>
          <Col span={8}>
            <Form.Item label={'用户名'} style={{ marginBottom: '8px' }}>
              <Input value={searchParams.username} placeholder='用户名' onChange={e => setSearchParams({ ...searchParams, username: e.target.value })} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'邮箱'} style={{ marginBottom: '8px' }}>
              <Input value={searchParams.email} placeholder='邮箱' onChange={e => setSearchParams({ ...searchParams, email: e.target.value })} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'奖项'} style={{ marginBottom: '8px' }}>
              <Select value={searchParams.award || undefined} placeholder="奖项" options={items} onChange={(value) => setSearchParams({ ...searchParams, award: value })} />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {way !== 'view' && <>
                <Button
                  style={{ width: '90px', marginRight: '16px' }}
                  type="primary"
                  onClick={() => {
                    setVisible(true)
                  }}
                >新增</Button>
                <Popconfirm title={"确认清空?清空后不可恢复!"} okText={"确认"} cancelText={"取消"}
                  onConfirm={() => {
                    if (competition) {
                      setCompetition({ ...competition, winners: [] })
                      setFilteredWinners([])
                    }
                  }}>
                  <Button type='primary' danger style={{ width: '90px' }}>清空</Button>
                </Popconfirm>
              </>}
            </div>
            <div>
              <Button
                style={{ width: '90px', marginRight: '16px' }}
                onClick={() => {
                  setSearchParams({ username: '', email: '', award: '' });
                  filter(true);
                }}
              >重置</Button>
              <Button type='primary' onClick={() => filter()} style={{ width: '90px' }}>搜索</Button>
            </div>
          </Col>
        </Row>
      </Form>

      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false)
          setSelectedRowKeys([])
        }}
        okText={'确认'}
        cancelText={'取消'}
        title={'新增'}
        width={600}
        onOk={async () => {
          try {
            await form.validateFields()
            const winners: Competition.Winner[] = selectedRowKeys.map((_id) => ({
              ...canAddList.find(participant => participant._id === _id) as Competition.Winner,
              award: searchAddParams.award
            }))
            if (competition) {
              const limit = competition.awardSetting.find(award => award.award === searchAddParams.award)?.limit as number;
              const exist = competition.winners.filter(winner => winner.award === searchAddParams.award).length
              if (!(limit < selectedRowKeys.length + exist)) {
                setCompetition({ ...competition, winners: [...competition?.winners, ...winners] })
                setFilteredWinners([...filteredWinners, ...winners])
              } else {
                message.error('选中数量不得大于奖项限制人数')
                setSelectedRowKeys([])
              }
            }
            setSelectedRowKeys([])
          } catch (error) {
            message.error('请先设置奖项')
            setSelectedRowKeys([])
          }
        }}
      >
        <Form labelCol={{ span: 7 }} form={form}>
          <Row>
            <Col span={12}>
              <Form.Item label={'用户名'} name="username" style={{ marginBottom: '8px' }}>
                <Input value={searchAddParams.username} placeholder='用户名' onChange={e => setSearchAddParams({ ...searchAddParams, username: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'邮箱'} name="email" style={{ marginBottom: '8px' }}>
                <Input value={searchAddParams.email} placeholder='邮箱' onChange={e => setSearchAddParams({ ...searchAddParams, email: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'设置奖项'} name="award" style={{ marginBottom: '8px' }}
                rules={[{ required: true, message: '不能为空' }]}
              >
                <Select value={searchAddParams.award || undefined} placeholder="奖项" options={items} onChange={(value) => setSearchAddParams({ ...searchAddParams, award: value })} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          dataSource={canAddList}
          rowKey={record => record._id || record.username}
          columns={pColumns.filter(c => c.key !== 'operation')}
          rowSelection={{
            async onChange(selectedRowKeys, selectedRows, info) {
              try {
                await form.validateFields()
                if (competition) {
                  const limit = competition.awardSetting.find(award => award.award === searchAddParams.award)?.limit as number;
                  const exist = competition.winners.filter(winner => winner.award === searchAddParams.award).length
                  if (!(limit < selectedRowKeys.length + exist)) {
                    setSelectedRowKeys(selectedRowKeys)
                  } else {
                    message.error('选中数量不得大于奖项设置数量')
                  }
                }
              } catch (error) {
                message.error('请先选择奖项')
              }
            },
            selectedRowKeys: selectedRowKeys,
          }}
        />
      </Modal>

      <Table
        style={{ marginTop: '8px' }}
        dataSource={filteredWinners}
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
