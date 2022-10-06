/*
 * @Author: tohsaka888
 * @Date: 2022-09-15 10:09:49
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 11:42:26
 * @Description: 请填写简介
 */

import { Button, Col, DatePicker, Form, Input, message, Row } from 'antd'
import { activityUrl } from 'config/baseUrl'
import useLoginStatus from 'hooks/useLoginStatus'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity } from 'typings/activity'
import { ActivityContext } from './context'
import ImageUploader from './ImageUploader'
import styles from './index.module.css'

function ActivityDetail() {
  const router = useRouter()
  const [form] = Form.useForm()
  const { id, token, way } = router.query
  const [activity, setActivity] = useState<Activity.Activity & { _id: string }>(null!)
  const { data } = useLoginStatus()

  const formattedActivity = useMemo(() => {
    if (activity) {
      return {
        ...activity,
        createdTime: moment(activity.createdTime),
        updatedTime: moment(activity.updatedTime),
        author: activity.author
      }
    } else {
      if (data) {
        return {
          createdTime: moment(),
          updatedTime: moment(),
          author: data.result.adminName
        }
      } else {
        return undefined
      }
    }
  }, [activity, data])

  useEffect(() => {
    const getActivityDetail = async () => {
      const res = await fetch(`${activityUrl}/api/activity/${id}`, {
        method: 'GET',
        mode: 'cors'
      })

      const data = await res.json()
      setActivity(data.activity)
    }
    if (id && (way !== 'add')) {
      getActivityDetail()
    }
  }, [id, way])

  const add = useCallback(async () => {
    try {
      if (data) {
        await form.validateFields()
        const res = await fetch(`${activityUrl}/api/activity/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            activity: {
              ...activity,
              createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              updatedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              author: data.result.adminName
            }
          })
        })
        const resData = await res.json()
        if (resData.success) {
          if (data.isCreated) {
            message.success('新增成功')
            router.back()
          } else {
            message.error('新增失败')
          }
        } else {
          message.error(data.error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [activity, data, form, router])

  const save = useCallback(() => {
    if (way === 'add') {
      add()
    }
  }, [add, way])

  return (
    <>
      {data && (way === 'add' || activity) &&
        <ActivityContext.Provider value={{ activity, setActivity }}>
          <div className={styles['content-container']}>
            {activity && <div className={styles['part-container']}>
              <div className={styles.title}>
                {activity.name}
              </div>
            </div>}

            <div className={styles['part-container']}>
              <div className={styles['part-title']}>
                基本信息
              </div>

              <Form form={form} labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} initialValues={formattedActivity}>
                <Row style={{ marginTop: '16px' }}>
                  <Col span={8} >
                    <Form.Item name={'name'} label={'活动名称'} rules={[{ required: true, message: '请输入活动名称' }]}>
                      {way !== 'view'
                        ? <Input placeholder="请输入活动名称" onChange={(e) => { setActivity({ ...activity, name: e.target.value }) }} />
                        : activity.name
                      }
                    </Form.Item>
                  </Col>
                  <Col span={8} >
                    <Form.Item name={'createdTime'} label={'创建时间'}>
                      {way !== 'view'
                        ? <DatePicker disabled style={{ width: '100%' }} />
                        : activity.createdTime
                      }
                    </Form.Item>
                  </Col>
                  <Col span={8} >
                    <Form.Item name={'updatedTime'} label={'更新时间'}>
                      {way !== 'view'
                        ? <DatePicker disabled style={{ width: '100%' }} />
                        : activity.updatedTime
                      }
                    </Form.Item>
                  </Col>
                  <Col span={8} >
                    <Form.Item name={'author'} label={'创建者'}>
                      {way !== 'view'
                        ? <Input placeholder={'自动生成'} disabled />
                        : activity.author
                      }
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name={'intro'} label={'活动详情'} rules={[{ required: true, message: '请输入活动名称' }]}
                      labelCol={{ span: 3 }}
                    >
                      {way !== 'view'
                        ? <Input.TextArea placeholder="请输入活动内容" rows={8} showCount maxLength={500}
                          onChange={(e) => { setActivity({ ...activity, intro: e.target.value }) }}
                        />
                        : activity.intro
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

            <ImageUploader />
            <div className={styles['part-container']} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ width: '90px', marginRight: '8px' }} onClick={() => router.back()}>返回</Button>
              <Button type="primary" style={{ width: '90px', marginLeft: '8px' }} onClick={save}>保存</Button>
            </div>
          </div>

        </ActivityContext.Provider>

      }
    </>
  )
}

export default ActivityDetail