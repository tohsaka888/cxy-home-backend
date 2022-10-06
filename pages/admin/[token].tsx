/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:16:39
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 16:29:46
 * @Description: 请填写简介
 */

import { Button, Layout, Result } from "antd";
import useLoginStatus from "hooks/useLoginStatus";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Header from "../../components/Header";

function Admin() {
  const { data } = useLoginStatus();
  const { push } = useRouter();

  const hasPermission = useMemo(() => {
    if (data.result.permissions.includes("管理员")) {
      return true;
    } else {
      return false;
    }
  }, [data.result.permissions]);
  return (
    <Layout>
      <Header />
      {hasPermission ? (
        <>
        
        </>
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
