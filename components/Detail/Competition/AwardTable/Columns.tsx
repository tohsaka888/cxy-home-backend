/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 10:21:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 10:42:43
 * @Description: 请填写简介
 */

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
    render() {
      return (
        <>
          <a>删除</a>
        </>
      )
    }
  }
]
