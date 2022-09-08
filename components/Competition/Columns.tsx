/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 17:08:16
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 11:26:28
 * @Description: 请填写简介
 */

import Link from "next/link";

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 70,
    fixed: 'left' as 'left',
    render: (_: any, __: any, index: number) => index + 1
  },
  {
    title: '比赛名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator',
    render(text: Competition.Creator, record: Competition.Competition) {
      return text.username
    }
  },
  {
    title: '举办地点',
    dataIndex: 'info',
    key: 'place',
    render(text: Competition.Info, record: Competition.Competition) {
      return text.place
    }
  },
  {
    title: '比赛方式',
    dataIndex: 'info',
    key: 'way',
    render(text: Competition.Info, record: Competition.Competition) {
      return text.way
    }
  },
  {
    title: '限报人数',
    dataIndex: 'info',
    width: 90,
    key: 'limit',
    render(text: Competition.Info, record: Competition.Competition) {
      return text.limit
    }
  },
  {
    title: '比赛时长',
    dataIndex: 'info',
    key: 'duration',
    render(text: Competition.Info, record: Competition.Competition) {
      return text.duration
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 180,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 150,
    fixed: 'right' as 'right',
    render(text: any, record: any) {
      const token = localStorage.getItem('token');
      return <div style={{ display: 'flex', justifyContent: 'space-between', width: '120px' }}>
        <a>删除</a>
        <Link href={`/detail/competition/edit/${record._id}/${token}`}>编辑</Link>
        <Link href={`/detail/competition/view/${record._id}/${token}`}>查看</Link>
      </div>
    }
  }
];