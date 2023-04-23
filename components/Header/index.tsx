import { Button, Layout, Menu } from "antd";
import useLoginStatus from "hooks/useLoginStatus";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export const menuItems = [
  { label: "比赛模块", key: "competition" },
  { label: "管理员模块", key: "admin" },
  { label: "活动模块", key: "activity" },
  { label: "题库模块", key: "questions" },
];

function Header() {
  const router = useRouter();
  const path = router.pathname.split("/")[1];
  const tokenRef = useRef<string>("");
  const { mutate } = useLoginStatus();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    tokenRef.current = localStorage.getItem("token") || "";
  }, []);
  return (
    <Layout.Header
      style={{
        position: "sticky",
        top: "0px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Menu
        items={menuItems}
        mode={"horizontal"}
        theme={"dark"}
        defaultSelectedKeys={[path]}
        onClick={(info) => {
          router.push(`/${info.key}/${tokenRef.current}`);
        }}
      />
      <Button
        type="primary"
        danger
        loading={loading}
        onClick={async () => {
          localStorage.clear();
          setLoading(true);
          await mutate();
          setLoading(false);
          router.push("/");
        }}
      >
        退出登录
      </Button>
    </Layout.Header>
  );
}

export default Header;
