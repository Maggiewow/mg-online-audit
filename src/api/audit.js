/*
 * @文件描述: 在线审片
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-06-11 11:21:51
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2023-01-13 11:36:52
 */
// import axios from '@/libs/api.request';
// import { getToken } from '@/libs/util';
import { SUCAI_URL } from '@/libs/constant'
import commonAxios from 'ym-bridge-shandianyun'

const Formdata_Headers = {
  'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
  platform: 'PC',
  version: '1.0.0',
  // Token: getToken(),
}

// 将Object转换为FormData
export const ObjectToFormData = (objData) => {
  let formData = new FormData()
  Object.entries(objData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  // console.log('formData数据', formData.has('comment'), formData.get('comment'));
  formData.forEach((it) => {
    console.log('forEach', it)
  })
  return formData
}

// 素材版本查看
export const getSucaiVersionDetail = (file_id, version = '0') => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}`,
    method: 'get',
  })
}
// 素材版本更新 /file/{FILE_ID}/version
export const updateSucaiVersion = (file_id, url) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version`,
    method: 'post',
    data: { url },
  })
}

// 版本批注创建 content timeline parent_id file
export const createVersionComment = (
  file_id,
  version = '0',
  content,
  timeline,
  frame_pos,
  file
) => {
  timeline = parseInt(timeline)
  let objData = { content, timeline, frame_pos, parent_id: '0', file }
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}/audit`,
    method: 'post',
    data: ObjectToFormData(objData),
    // headers: Formdata_Headers,
  })
}
// 版本批注回复 content parent_id
export const replayVersionComment = (file_id, version = '0', content, parent_id) => {
  let objData = { content, parent_id }
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}/audit`,
    method: 'post',
    data: ObjectToFormData(objData),
    // headers: Formdata_Headers,
  })
}
// 版本批注列表 page,per_page,order_type,sort_type,is_resolve
export const getAuditHistory = (file_id, version = '0', page, order_type, is_resolve) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}/audits`,
    method: 'get',
    params: {
      page,
      per_page: 15,
      order_type,
      sort_type: 'asc', // asc | desc
      is_resolve,
    },
  })
}

// 版本批注删除 /file/version-audit/{ID}
export const removeVersionAudit = (id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/version-audit/${id}`,
    method: 'delete',
  })
}

// 版本批注解决
export const completeVersionAudit = (id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/version-audit/${id}/resolve`,
    method: 'post',
  })
}

// 转码下载地址
export const getVersionTranscodeUrl = (file_id, version = '0') => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}/transcode-url`,
    method: 'get',
  })
}

// 原片下载地址
export const getVersionOriginUrl = (file_id, version = '0') => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}/origin-url`,
    method: 'get',
  })
}

// 文件关联文稿
export const bindArticle = (file_id, ids) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/bind-article`,
    method: 'post',
    data: { ids },
  })
}

// 文件关联串联单下的文稿 series_id, source_id, remote_item_id
export const bindSeriesArticle = (file_id, ids) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/bind-series-item`,
    method: 'post',
    data: { ids },
  })
}

// 文件关联整个串联单
export const bindSeries = (file_id, ids) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/bind-series`,
    method: 'post',
    data: { ids },
  })
}

// 获取本视频已经绑定的文稿和串联单文稿
export const getVideoRelatedArticles = (file_id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/local-bound/mix-articles`,
    method: 'get',
  })
}
// 本视频已经绑定的文稿
export const getRelatedArticles = (file_id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/relation/local-articles`,
    method: 'get',
  })
}
// 文件关联串联单文稿 本视频已经绑定的串联单文稿
export const getRelatedSerieArticles = (file_id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/relation/local-series-articles`,
    method: 'get',
  })
}
//  版本删除
export const removeVideoVersion = (file_id, version = '0') => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${file_id}/version/${version}`,
    method: 'delete',
  })
}
// 下载记录 /file/337/download-log
export const fetchDownloadLogs = (id) => {
  return commonAxios.request({
    url: SUCAI_URL + `/file/${id}/download-log`,
    method: 'get',
  })
}
