/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:16:39
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 16:29:46
 * @Description: 请填写简介
 */

import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Result,
  Select,
  Table,
} from "antd";
import { loginUrl } from "config/baseUrl";
import useAdminList from "hooks/useAdminList";
import useLoginStatus from "hooks/useLoginStatus";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import Header from "../../components/Header";

function Admin() {
  const { data } = useLoginStatus();
  const { push } = useRouter();
  const { list, loading, mutate } = useAdminList();
  const [open, setOpen] = useState<boolean>(false);
  const [admin, setAdmin] = useState<{
    adminName: string;
    adminPass: string;
    permissions: string[];
  }>({ adminName: "", adminPass: "", permissions: [] });
  const [form] = Form.useForm();

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`${loginUrl}/api/admin/delete`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [id] }),
    });
    const data = await res.json();
    if (data.success) {
      message.success("删除成功");
      mutate();
    }
  };

  const hasPermission = useMemo(() => {
    if (data && data.success) {
      if (data.result.permissions.includes("管理员")) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, [data]);

  const addAdmin = async () => {
    await form.validateFields();
    const res = await fetch(`${loginUrl}/api/admin/add`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    });
    const data = await res.json();
    if (data.success) {
      message.success("添加成功");
      mutate();
      setOpen(false);
    }
  };

  const columns = useMemo(() => {
    return [
      {
        dataIndex: "adminName",
        key: "adminName",
        title: "管理员",
      },
      {
        dataIndex: "permissions",
        key: "permissions",
        title: "权限",
        render(text: string[]) {
          return text.join("/");
        },
      },
      {
        dataIndex: "operation",
        key: "operation",
        title: "操作",
        render: (text: any, record: any) => (
          <>
            <span
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => {
                deleteAdmin(record._id);
              }}
            >
              删除
            </span>
          </>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataSource = useMemo(() => {
    if (data && list) {
      return list.filter((item: any) => item._id !== data.result._id);
    } else {
      return [];
    }
  }, [data, list]);

  return (
    <Layout>
      {/* <Header /> */}
      <Modal
        title={"新增"}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        okText={"确认"}
        cancelText={"取消"}
        onOk={() => {
          addAdmin();
        }}
        // footer={null}
      >
        <Form form={form}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input
              placeholder="请输入名称"
              onChange={(e) =>
                setAdmin({ ...admin, adminName: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              placeholder="请输入密码"
              type="password"
              onChange={(e) => {
                setAdmin({ ...admin, adminPass: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item
            label="权限"
            name="permissions"
            rules={[{ required: true, message: "请输入权限" }]}
          >
            <Select
              placeholder="请输入权限"
              onSelect={(value: string) => {
                setAdmin({ ...admin, permissions: [value] });
              }}
              options={[
                {
                  label: "管理员",
                  value: "管理员",
                },
                {
                  label: "活动",
                  value: "活动",
                },
                {
                  label: "比赛",
                  value: "比赛",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      {hasPermission ? (
        <div style={{ margin: "0px 18vw", minHeight: "calc(100vh - 65px)" }}>
          <div style={{ margin: "16px 0px" }}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => {
                setOpen(true);
              }}
            >
              新增
            </Button>
          </div>
          <Table loading={loading} columns={columns} dataSource={dataSource} />
        </div>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="对不起,您无权操作!"
          extra={
            <Button
              type="primary"
              onClick={() => {
                localStorage.clear();
                push("/");
              }}
            >
              Back Home
            </Button>
          }
        />
      )}
    </Layout>
  );
}

export default Admin;
