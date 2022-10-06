/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 16:17:20
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 17:15:49
 * @Description: 请填写简介
 */

import { Button, Layout, Result } from "antd";
import useLoginStatus from "hooks/useLoginStatus";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import CompetitionList from "../../components/Competition";
import Header from "../../components/Header";

function Competition() {
  const { data } = useLoginStatus();
  const { push } = useRouter();

  const hasPermission = useMemo(() => {
    if (
      data.result.permissions.includes("管理员") ||
      data.result.permissions.includes("比赛")
    ) {
      return true;
    } else {
      return false;
    }
  }, [data.result.permissions]);

  return (
    <Layout>
      <Header />
      <Layout>
        <Layout.Content
          style={{
            minHeight: "calc(100vh - 65px)",
            width: "70vw",
            marginLeft: "15vw",
          }}
        >
          {hasPermission ? (
            <CompetitionList />
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
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default Competition;
