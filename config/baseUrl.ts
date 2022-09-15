/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 15:24:13
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 15:26:28
 * @Description: 请填写简介
 */

export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cxy-home-backend.netlify.app'
export const activityUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://cxy-home-backend-activity.netlify.app'
export const competitionUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://cxy-home-backend-competition.netlify.app'
export const loginUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3003' : 'https://cxy-home-backend-login.netlify.app'