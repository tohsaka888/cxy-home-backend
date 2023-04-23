/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:17:45
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 09:26:50
 * @Description: 请填写简介
 */

import { Button, Layout, Result } from "antd";
import ActivityList from "components/Activity/ActivityList";
import useLoginStatus from "hooks/useLoginStatus";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Header from "../../components/Header";

function Activity() {
  const { data } = useLoginStatus();
  const { push } = useRouter();
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
  return (
    // <Layout>
    //   <Header />
    <>
      {hasPermission ? (
        <ActivityList />
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
    </>
  );
}

export default Activity;
