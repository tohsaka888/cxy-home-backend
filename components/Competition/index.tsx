/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:42:03
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-06 15:46:15
 * @Description: 请填写简介
 */

import { Divider, Form, Col, Row, Input, Table, Button, DatePicker } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { competitionUrl } from '../../config/baseUrl'
import { columns } from './Columns'
import style from './index.module.css'
import moment from 'moment'

type SearchParams = {
  place?: string;
  name?: string;
  username?: string;
  createdStartTime?: string;
  createdEndTime?: string;
}

function CompetitionList() {
  const [list, setList] = useState<(Competition.Competition & {_id: string})[]>([])
  const [searchParams, setSearchParams] = useState<SearchParams>({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${competitionUrl}/api/competition/list`, {
        mode: 'cors'
      })
      const data = await res.json()
      setList(data.list)
    }
    fetchData()
  }, [])

  const search = useCallback(async (isReset?: boolean) => {
    const res = await fetch(`${competitionUrl}/api/competition/search`, {
      method: 'POST',
      body: JSON.stringify(isReset ? {} : searchParams),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setList(data.list)
  }, [searchParams])

  return (
    <>
      <div className={style['competition-container']}>
        <div className={style['competition-title']}>
          比赛模块
        </div>
      </div>

      <div className={style['competition-container']}>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Row>
            <Col span={8} style={{ marginTop: '16px' }}>
              <Form.Item label={'比赛名称'} id={'name'}>
                <Input placeholder="请输入比赛名称" value={searchParams.name || ''} onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: '16px' }}>
              <Form.Item label={'创建者'}>
                <Input placeholder="请输入创建者" value={searchParams.username || ''} onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: '16px' }}>
              <Form.Item label={'比赛地点'} name={'id'}>
                <Input placeholder="请输入比赛地点" value={searchParams.place || ''} onChange={(e) => setSearchParams({ ...searchParams, place: e.target.value })} />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '30px', alignItems: 'flex-end' }}>
                <Button
                  style={{ marginRight: '16px' }}
                  onClick={() => {
                    setSearchParams({})
                    search(true)
                  }}
                >重置</Button>
                <Button type="primary" onClick={() => search()}>查询</Button>
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col span={8} />
            <Col span={8} />
           
          </Row> */}
        </Form>
      </div>

      <div className={style['competition-container']}>
        <Table
          dataSource={list}
          columns={columns}
          scroll={{ x: 1500 }}
          rowKey={record => record._id}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showPrevNextJumpers: true
          }}
        />
      </div>
    </>
  )
}

export default CompetitionList
