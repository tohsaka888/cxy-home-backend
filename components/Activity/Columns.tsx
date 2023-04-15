/*
 * @Author: tohsaka888
 * @Date: 2022-09-15 09:50:47
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 10:55:43
 * @Description: 请填写简介
 */

import moment from "moment";
import Link from "next/link";
import { useContext } from "react";
import { Activity } from "typings/activity";
import { LoadingContext } from "./context";

const Operation = ({ record }: { record: any }) => {
  const token = localStorage.getItem("token");
  const { setLoading } = useContext(LoadingContext)!;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "70px",
      }}
    >
      {/* <a>删除</a> */}
      <Link
        href={`/detail/activity/edit/${record._id}/${token}`}
        onClick={() => {
          setLoading(true);
        }}
      >
        编辑
      </Link>
      <Link
        href={`/detail/activity/view/${record._id}/${token}`}
        onClick={() => {
          setLoading(true);
        }}
      >
        查看
      </Link>
    </div>
  );
};

export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: 70,
    fixed: "left" as "left",
    render: (_: any, __: any, index: number) => index + 1,
  },
  {
    title: "活动名称",
    dataIndex: "name",
    key: "name",
    width: 220,
    ellipsis: { showTitle: true },
  },
  {
    title: "创建者",
    dataIndex: "author",
    key: "author",
    width: 140,
    render(text: string, record: Activity.Activity) {
      return text;
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    key: "createdTime",
    width: 180,
    sorter: {
      compare(a: any, b: any) {
        if (moment(a.createdTime).isBefore(moment(b.createdTime))) {
          return 1;
        } else {
          return -1;
        }
      },
    },
  },
  {
    title: "更新时间",
    dataIndex: "updatedTime",
    key: "updatedTime",
    width: 180,
    sorter: {
      compare(a: any, b: any) {
        if (moment(a.updatedTime).isBefore(moment(b.updatedTime))) {
          return 1;
        } else {
          return -1;
        }
      },
      defaultSortOrder: "ascend",
    },
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    width: 100,
    fixed: "right" as "right",
    render(text: any, record: any) {
      return <Operation record={record} />;
    },
  },
];
