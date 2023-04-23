/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 10:10:55
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 16:21:44
 * @Description: 请填写简介
 */
import { Button, Form, Input, Layout, message } from "antd";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { loginUrl } from "../config/baseUrl";
import useLoginStatus from "../hooks/useLoginStatus";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [form] = Form.useForm();
  const [account, setAccount] = useState<{
    adminName: string;
    adminPass: string;
  }>({ adminName: "", adminPass: "" });
  const router = useRouter();

  const { data, mutate } = useLoginStatus();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (token && data && data.isLogin) {
      router.push(`/competition/${token}`);
    }
  }, [data, router]);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await form.validateFields();
      if (!error) {
        const res = await fetch(`${loginUrl}/api/login`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(account),
        });
        const data = await res.json();
        localStorage.setItem("token", data.token);
        await mutate();
        setLoading(false);
      }
    } catch (error) {
      message.error((error as Error).message || "账号密码不得为空");
    }
  }, [account, form, mutate]);

  return (
    // <SWRConfig value={{ fallback }}>

    <div className={styles["login-container"]}>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={form}>
        <Form.Item
          name="adminName"
          label={"管理员账号"}
          rules={[{ required: true, message: "请输入账号!" }]}
        >
          <Input
            placeholder="请输入账号"
            onChange={(e) =>
              setAccount({ ...account, adminName: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          name="adminPass"
          label={"管理员密码"}
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            placeholder="请输入密码"
            type="password"
            onChange={(e) =>
              setAccount({ ...account, adminPass: e.target.value })
            }
          />
        </Form.Item>
        <div className={styles["login-button"]}>
          <Button
            type="primary"
            style={{ width: "200px" }}
            onClick={() => login()}
            loading={loading}
          >
            登录
          </Button>
        </div>
      </Form>
    </div>
    // </SWRConfig>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   console.log(localStorage.getItem('token'))
//   return {
//     props: {

//     }
//   }
// }

export default Home;
