/*
 * @Author: tohsaka888
 * @Date: 2022-09-09 16:20:35
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-15 10:51:56
 * @Description: 请填写简介
 */

import {
  Button,
  Image,
  Popconfirm,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { getBase64 } from "utils/getBase64";
import styles from "../index.module.css";
import { AiOutlineUpload } from "react-icons/ai";
import { ActivityContext } from "../context";

function ImageUploader() {
  const { activity, setActivity } = useContext(ActivityContext)!;
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (activity) {
      return activity.images;
    } else {
      return [];
    }
  });

  const onChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      if (fileList.find((file) => file.uid === info.file.uid)) {
        return;
      }
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setFileList((list) => [
          ...list,
          {
            status: "done",
            name: info.file.name,
            url: url,
            uid: info.file.uid,
          },
        ]);
      });
    },
    []
  );

  useEffect(() => {
    setActivity((activity) => {
      return { ...activity, images: fileList };
    });
  }, [fileList, setActivity]);

  return (
    <>
      <div className={styles["part-container"]}>
        <div className={styles["part-title"]}>上传/预览图片</div>
        <Upload
          name="avatar"
          showUploadList={false}
          fileList={fileList}
          onChange={onChange}
          disabled={fileList.length >= 4}
        >
          <Button
            icon={<AiOutlineUpload />}
            disabled={fileList.length >= 4}
            style={{ marginTop: "8px" }}
          >
            <span style={{ marginLeft: "8px" }}>点击上传</span>
          </Button>
        </Upload>
        <div style={{ marginTop: "8px" }}>
          <Image.PreviewGroup>
            {fileList.map((file) => {
              return (
                <>
                  <Popconfirm
                    title="删除图片?"
                    trigger={"hover"}
                    okText={"确认"}
                    cancelText={"取消"}
                    placement={"topRight"}
                    onConfirm={() => {
                      setFileList((list) =>
                        list.filter((item) => item.uid !== file.uid)
                      );
                    }}
                  >
                    <Image
                      src={file.url}
                      key={file.uid}
                      alt={file.name}
                      width={300}
                      height={200}
                    />
                  </Popconfirm>
                </>
              );
            })}
          </Image.PreviewGroup>
        </div>
      </div>
    </>
  );
}

export default ImageUploader;
