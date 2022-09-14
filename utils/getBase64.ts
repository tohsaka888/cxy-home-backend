/*
 * @Author: tohsaka888
 * @Date: 2022-09-14 08:34:46
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-14 09:24:47
 * @Description: 请填写简介
 */
import type { RcFile } from 'antd/es/upload/interface';
import { debounce } from 'lodash';

export const getBase64 = debounce((img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}, 500);
