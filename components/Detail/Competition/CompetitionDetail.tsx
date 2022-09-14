/*
 * @Author: tohsaka888
 * @Date: 2022-09-07 11:35:44
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-14 10:07:42
 * @Description: 请填写简介
 */
import { Button, Col, DatePicker, Form, Input, Layout, message, Row, Typography } from 'antd'
import Header from 'components/Header'
import { competitionUrl } from 'config/baseUrl'
import { CompetitionContext } from 'context/context'
import useCompetitionDetail from 'hooks/useCompetitionDetail'
import useLoginStatus from 'hooks/useLoginStatus'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AwardTable from './AwardTable'
import ImageUploader from './ImageUploader'
import styles from './index.module.css'
import ParticipantsTable from './ParticipantsTable'

const initCompetition = {
  name: '',
  createdTime: '',
  creator: {
    username: '',
    email: '',
  },
  updatedTime: '',
  participants: [],
  awardSetting: [{ award: '一等奖', limit: 0 }, { award: '二等奖', limit: 0 }, { award: '三等奖', limit: 0 }, { award: '优秀奖', limit: 0 }],
  winners: [],
  intro: '',
  info: {
    place: '',
    way: '',
    signUpStart: '',
    signUpEnd: '',
    limit: 0,
    time: '',
    duration: '0小时',
  },
  banners: [],
}

function CompetitionDetail() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [awardForm] = Form.useForm()
  const { id, token, way } = router.query
  const [competition, setCompetition] = useState<(Competition.Competition & { _id?: string }) | null>(null)
  const onSuccess = useCallback((data: any) => {
    setCompetition(data.success ? data.competition : initCompetition)
  }, [])

  const { data: loginStatus } = useLoginStatus()

  const formattedCompetition = useMemo(() => {
    return competition ? {
      ...competition,
      info: {
        ...competition.info,
        signUpStart: competition.info.signUpStart ? moment(competition.info.signUpStart) : undefined,
        signUpEnd: competition.info.signUpEnd ? moment(competition.info.signUpEnd) : undefined,
        time: competition.info.time ? moment(competition.info.time) : undefined,
        duration: +competition.info.duration.split('小时')[0]
      }
    } : undefined
  }, [competition])

  useEffect(() => {
    if (way === 'add') {
      setCompetition(initCompetition)
    }
  }, [way])

  const onError = useCallback((error: any) => {
    message.error(error)
  }, [])

  useCompetitionDetail({ way: (way as string), id: (id as string) || '', onSuccess, onError })

  const edit = useCallback(async () => {
    if (competition) {
      competition.updatedTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const res = await fetch(`${competitionUrl}/api/competition/edit`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ competition: { ...competition, id, } }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.isEdit) {
          message.success('修改成功')
        } else {
          message.error('修改失败')
        }
      } else {
        message.error(data.error)
      }
    }
  }, [competition, id])

  const add = useCallback(async () => {

    if (competition && loginStatus) {
      const username = loginStatus?.result.adminName
      const email = '19030420@czu.com'
      competition.createdTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      competition.updatedTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      competition.creator = { username, email }

      const res = await fetch(`${competitionUrl}/api/competition/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ competition })
      })
      const data = await res.json()
      if (data.success) {
        if (data.isCreated) {
          message.success('新增成功')
          router.back()
          // mutate(`${competitionUrl}/api/competition/${id}`, update)
        } else {
          message.error('新增失败')
        }
      } else {
        message.error(data.error)
      }
    }
  }, [competition, loginStatus, router])

  const save = useCallback(async () => {
    try {
      await form.validateFields()
      await awardForm.validateFields()
      if (way === 'edit') {
        edit()
      }

      if (way === 'add') {
        add()
      }
    } catch (error: any) {
      message.error('表单校验错误')
      return
    }
  }, [add, awardForm, edit, form, way])

  return (
    <>
      <Header />
      <Layout>
        <Layout.Content>
          <CompetitionContext.Provider value={{ competition, setCompetition }}>
            <div className={styles['container']}>
              {competition && competition.name && <div className={styles['part-container']}>
                <div className={styles['title']}>{competition.name}</div>
              </div>}

              <div className={styles['part-container']}>
                <div className={styles['part-title']}>基本信息</div>
                {competition &&
                  <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} initialValues={formattedCompetition} form={form}>
                    <Row style={{ marginTop: '16px' }}>
                      <Col span={8}>
                        <Form.Item label={"比赛名称"} name={'name'} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入比赛名称' }]}
                        >
                          {way === 'view'
                            ? competition?.name
                            : <Input placeholder='请输入比赛名称' value={competition.name} onChange={(e) => setCompetition({ ...competition, name: e.target.value })} />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"创建时间"} name={'createdTime'} style={{ marginBottom: '16px' }}>
                          {way === 'view'
                            ? competition?.createdTime
                            : <Input placeholder='请输入创建时间' value={competition?.createdTime} disabled />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"更新时间"} name={'updatedTime'} style={{ marginBottom: '16px' }}>
                          {way === 'view'
                            ? competition?.updatedTime
                            : <Input placeholder='请输入更新时间' value={competition?.updatedTime} disabled />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"举办地点"} name={['info', 'place']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入举办地点' }]}
                        >
                          {way === 'view'
                            ? competition?.info.place
                            : <Input
                              placeholder='请输入举办地点'
                              value={competition?.info.place}
                              onChange={(e) => setCompetition({ ...competition, info: { ...competition.info, place: e.target.value } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"比赛方式"} name={['info', 'way']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入比赛方式' }]}
                        >
                          {way === 'view'
                            ? competition?.info.way
                            : <Input
                              placeholder='请输入比赛方式'
                              value={competition?.info.way}
                              onChange={(e) => setCompetition({ ...competition, info: { ...competition.info, way: e.target.value } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"限报人数"} name={['info', 'limit']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入比赛方式' }]}
                        >
                          {way === 'view'
                            ? competition?.info.limit
                            : <Input
                              placeholder='请输入比赛方式'
                              value={competition?.info.limit}
                              type={'number'}
                              onChange={(e) => setCompetition({ ...competition, info: { ...competition.info, limit: +e.target.value } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"开始报名时间"} name={['info', 'signUpStart']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入开始报名时间' }]}
                        >
                          {way === 'view'
                            ? competition?.info.signUpStart
                            : <DatePicker
                              placeholder='请选择开始报名时间'
                              format={'YYYY-MM-DD hh:mm:ss'}
                              style={{ width: '100%' }}
                              onChange={(date) => setCompetition({ ...competition, info: { ...competition.info, signUpStart: date?.format('YYYY-MM-DD hh:mm:ss') || '' } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"结束报名时间"} name={['info', 'signUpEnd']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入结束报名时间' }]}
                        >
                          {way === 'view'
                            ? competition?.info.signUpEnd
                            : <DatePicker
                              placeholder='请选择结束报名时间'
                              style={{ width: '100%' }}
                              format={'YYYY-MM-DD hh:mm:ss'}
                              onChange={(date) => setCompetition({ ...competition, info: { ...competition.info, signUpEnd: date?.format('YYYY-MM-DD hh:mm:ss') || '' } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"比赛时间"} name={['info', 'time']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入比赛时间' }]}
                        >
                          {way === 'view'
                            ? competition?.info.time
                            : <DatePicker
                              placeholder='请选择比赛时间'
                              style={{ width: '100%' }}
                              format={'YYYY-MM-DD hh:mm:ss'}
                              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                              onChange={(date) => setCompetition({ ...competition, info: { ...competition.info, time: date?.format('YYYY-MM-DD hh:mm:ss') || '' } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"比赛时长"} name={['info', 'duration']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入比赛方式' }]}
                        >
                          {way === 'view'
                            ? competition?.info.duration
                            : <Input
                              placeholder='请输入时长'
                              value={competition?.info.duration}
                              type={'number'}
                              suffix={'小时'}
                              onChange={(e) => setCompetition({ ...competition, info: { ...competition.info, duration: e.target.value + '小时' } })}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label={'介绍'} name={['intro']} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} style={{ marginBottom: '8px' }}
                          rules={[{ required: true, message: '请输入比赛方式' }]}
                        >
                          {way === 'view'
                            ? (
                              <Typography style={{ marginTop: '4px' }}>
                                <Typography.Paragraph ellipsis={{ rows: 5, expandable: true }}>
                                  {competition.intro}
                                </Typography.Paragraph>
                              </Typography>
                            )
                            : <Input.TextArea rows={5} onChange={(e) => setCompetition({ ...competition, intro: e.target.value })} />
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                }
              </div>
              <div className={styles['part-container']}>
                <div className={styles['part-title']}>奖项设置</div>
                {competition && <>
                  <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} initialValues={formattedCompetition} form={awardForm}>
                    <Row style={{ marginTop: '16px' }}>
                      <Col span={8}>
                        <Form.Item label={"一等奖"} name={['awardSetting', '0', 'limit']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入人数' }]}
                        >
                          {way === 'view'
                            ? competition?.awardSetting[0].limit
                            : <Input
                              placeholder='请输入人数'
                              value={competition?.awardSetting[0].limit}
                              type={'number'}
                              onChange={(e) => {
                                competition.awardSetting[0].limit = +e.target.value
                                setCompetition({ ...competition })
                              }}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"二等奖"} name={['awardSetting', '1', 'limit']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入人数' }]}
                        >
                          {way === 'view'
                            ? competition?.awardSetting[1].limit
                            : <Input
                              placeholder='请输入人数'
                              value={competition?.awardSetting[1].limit}
                              type={'number'}
                              onChange={(e) => {
                                competition.awardSetting[1].limit = +e.target.value
                                setCompetition({ ...competition })
                              }}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"三等奖"} name={['awardSetting', '2', 'limit']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入人数' }]}
                        >
                          {way === 'view'
                            ? competition?.awardSetting[2].limit
                            : <Input
                              placeholder='请输入人数'
                              value={competition?.awardSetting[2].limit}
                              type={'number'}
                              onChange={(e) => {
                                competition.awardSetting[2].limit = +e.target.value
                                setCompetition({ ...competition })
                              }}
                            />
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={"优秀奖"} name={['awardSetting', '3', 'limit']} style={{ marginBottom: '16px' }}
                          rules={[{ required: true, message: '请输入人数' }]}
                        >
                          {way === 'view'
                            ? competition?.awardSetting[3].limit
                            : <Input
                              placeholder='请输入人数'
                              value={competition?.awardSetting[3].limit}
                              type={'number'}
                              onChange={(e) => {
                                competition.awardSetting[3].limit = +e.target.value
                                setCompetition({ ...competition })
                              }}
                            />
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </>}
              </div>
              {competition?.banners && <ImageUploader />}
              {competition?.participants && <ParticipantsTable participants={competition?.participants} />}
              {competition?.winners && <AwardTable winners={competition?.winners || []} />}
              <div className={styles['part-container']} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button style={{ width: '90px', marginRight: '8px' }} onClick={() => router.back()}>返回</Button>
                <Button type="primary" style={{ width: '90px', marginLeft: '8px' }} onClick={save}>保存</Button>
              </div>
            </div>
          </CompetitionContext.Provider>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default CompetitionDetail