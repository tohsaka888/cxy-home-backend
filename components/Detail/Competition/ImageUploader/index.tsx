/*
 * @Author: tohsaka888
 * @Date: 2022-09-09 16:20:35
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-14 10:08:32
 * @Description: 请填写简介
 */

import { Button, Image, Popconfirm, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { getBase64 } from 'utils/getBase64';
import styles from '../index.module.css'
import { AiOutlineUpload } from 'react-icons/ai'
import { CompetitionContext } from 'context/context';

function ImageUploader() {
  const { setCompetition, competition } = useContext(CompetitionContext)!
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (competition) {
      return competition.banners
    } else {
      return []
    }
  });

  const onChange: UploadProps['onChange'] = useCallback((info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file.originFileObj as RcFile, url => {
      setFileList((list) => [...list, {
        status: 'done',
        name: info.file.name,
        url: url,
        uid: info.file.uid,
      }])
    });
  }, [])

  useEffect(() => {
    setCompetition((competition) => {
      if (competition) {
        return { ...competition, banners: fileList }
      } else {
        return null
      }
    })
  }, [fileList, setCompetition])

  return (
    <>
      <div className={styles['part-container']}>
        <div className={styles['part-title']}>
          上传/预览图片
        </div>
        <Upload
          name="avatar"
          showUploadList={false}
          fileList={fileList}
          onChange={onChange}
          disabled={fileList.length >= 4}
        >
          <Button icon={<AiOutlineUpload />} disabled={fileList.length >= 4} style={{ marginTop: '8px' }}>
            <span style={{ marginLeft: '8px' }}>点击上传</span>
          </Button>
        </Upload>
        <div style={{ marginTop: '8px' }}>
          <Image.PreviewGroup>
            {fileList.map(file => {
              return <>
                <Popconfirm title="删除图片?" trigger={'hover'} okText={'确认'} cancelText={'取消'}
                  placement={'topRight'}
                  onConfirm={() => {
                    setFileList((list) => list.filter(item => item.uid !== file.uid))
                  }}
                >
                  <Image src={file.url} key={file.uid} alt={file.name} width={300} height={200} />
                </Popconfirm>
              </>
            })}
          </Image.PreviewGroup>
        </div>
      </div>
    </>
  )
}

export default ImageUploader
