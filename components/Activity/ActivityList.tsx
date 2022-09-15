/*
 * @Author: tohsaka888
 * @Date: 2022-09-15 09:25:44
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 11:06:57
 * @Description: 请填写简介
 */

import { Button, Col, DatePicker, Form, Input, message, Popconfirm, Row, Table } from 'antd'
import search from 'antd/lib/transfer/search'
import { activityUrl, competitionUrl } from 'config/baseUrl'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Key, useCallback, useEffect, useState } from 'react'
import { Activity } from 'typings/activity'
import { columns } from './Columns'
import { LoadingContext } from './context'
import styles from './index.module.css'

type SearchParams = {
  // place?: string;
  name?: string;
  author?: string;
  createdStartTime?: string;
  createdEndTime?: string;
}

function ActivityList() {

  const [list, setList] = useState<(Activity.Activity & { _id: string })[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])

  const search = useCallback(async (isReset?: boolean) => {
    setLoading(true)
    const res = await fetch(`${activityUrl}/api/activity/search`, {
      method: 'POST',
      body: JSON.stringify(isReset ? {} : searchParams),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setList(data.list)
    setLoading(false)
  }, [searchParams])

  const deleteWithIds = async () => {
    const res = await fetch(`${activityUrl}/api/activity/delete`, {
      method: 'POST',
      body: JSON.stringify({ ids: selectedRowKeys }),
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })

    const data = await res.json()

    if (data.success) {
      if (data.isDeleted) {
        message.success('删除成功')
        search()
      } else {
        message.error('删除失败')
      }
    } else {
      message.error(data.error)
    }
  }

  const router = useRouter()

  const { token } = router.query

  useEffect(() => {
    search(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <div className={styles['content-container']}>
        <div className={styles['part-container']}>
          <div className={styles.title}>
            活动模块
          </div>
        </div>

        <div className={styles['part-container']}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
            <Row>
              <Col span={8} style={{ marginTop: '16px' }}>
                <Form.Item label={'比赛名称'} id={'name'}>
                  <Input placeholder="请输入比赛名称" value={searchParams.name || ''} onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })} />
                </Form.Item>
              </Col>
              <Col span={8} style={{ marginTop: '16px' }}>
                <Form.Item label={'创建者'}>
                  <Input placeholder="请输入创建者" value={searchParams.author || ''} onChange={(e) => setSearchParams({ ...searchParams, author: e.target.value })} />
                </Form.Item>
              </Col>
              {/* <Col span={8} style={{ marginTop: '16px' }}>
              <Form.Item label={'比赛地点'} name={'id'}>
                <Input placeholder="请输入比赛地点" value={searchParams.place || ''} onChange={(e) => setSearchParams({ ...searchParams, place: e.target.value })} />
              </Form.Item>
            </Col> */}
              <Col span={8} style={{ marginTop: '16px' }}>
                <Form.Item label={'开始创建时间'} name="createdStartTime">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请输入开始创建时间"
                    value={searchParams.createdStartTime ? moment(searchParams.createdStartTime) : null}
                    onChange={(date) => setSearchParams({ ...searchParams, createdStartTime: date?.format('YYYY-MM-DD hh:mm:ss') })}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={'结束创建时间'} name="createdEndTime">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请输入结束创建时间"
                    value={searchParams.createdEndTime ? moment(searchParams.createdStartTime) : null}
                    onChange={(date) => setSearchParams({ ...searchParams, createdEndTime: date?.format('YYYY-MM-DD hh:mm:ss') })}
                  />
                </Form.Item>
              </Col>
              <Col span={8} />
              <Col span={8}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '30px', alignItems: 'flex-end' }}>
                  <Button
                    style={{ marginRight: '16px' }}
                    onClick={() => {
                      setSearchParams({})
                      search(true)
                    }}
                  >重置</Button>
                  <Button type="primary" onClick={() => { search() }}>查询</Button>
                </div>
              </Col>
            </Row>
            {/* <Row>
            <Col span={8} />
            <Col span={8} />
           
          </Row> */}
          </Form>
        </div>

        <div className={styles['part-container']}>
          <div style={{ display: 'flex', height: '50px', alignItems: 'center', marginBottom: '6px' }}>
            <Button type="primary" style={{ marginRight: '8px', width: '90px' }}>
              <Link href={`/detail/activity/add/10086/${token}`}>
                新增
              </Link>
            </Button>
            <Popconfirm okText={'确认'} cancelText={'取消'} title={'确认删除?删除后无法恢复数据!'}
              onConfirm={deleteWithIds}
            >
              <Button danger type="primary" style={{ marginRight: '8px', width: '90px' }}>删除</Button>
            </Popconfirm>
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={list}
          />
        </div>
      </div>
    </LoadingContext.Provider>
  )
}

export default ActivityList
