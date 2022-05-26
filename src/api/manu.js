/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-27 09:52:10
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-05-26 09:34:59
 */
import commonAxios from 'ym-bridge-shandianyun';
import { ARTICLE_URL, SERIES_URL } from '@/libs/constant';

// 待审稿件/已发稿件/退回稿件 列表
export const getStatusArticleList = (item) => {
  return commonAxios.request({
    url: ARTICLE_URL + '/auditing-materials',
    method: 'get',
    params: item,
  });
};

// 列表---审核通过 弃用
export const getpassedSeriesData = (args) => {
  return commonAxios.request({
    url: SERIES_URL + '/series/passed',
    method: 'get',
    params: args,
  });
};
// 栏目列表
export const getSeriesCates = () => {
  return commonAxios.request({
    url: SERIES_URL + '/cate/allBroadcastCate',
    method: 'get',
  });
};

// 获取已经关联的串联单的列表 根据id /series/getSeriesListByIds?ids=37,31
export const getRelatedSeries = (idList) => {
  return commonAxios.request({
    url: SERIES_URL + '/series/getSeriesListByIds',
    method: 'get',
    params: { ids: idList.join() },
  });
};

// 关联串联单 串联单列表 /series/getSeriesListByData?page=1&perPage=10&cateId&date=2021-04-12
export const getAllSeriesList = (page, cateId, date) => {
  return commonAxios.request({
    url: SERIES_URL + '/series/getSeriesListByData',
    method: 'get',
    params: { page, perPage: 10, cateId, date },
  });
};

// 关联文稿-串联单文稿 /series/getSeriesItemByDate?cateId=2364&date=2021-04-12
export const getAllRelatedSeriesList = (cateId, date) => {
  return commonAxios.request({
    url: SERIES_URL + '/series/getSeriesItemByDate',
    method: 'get',
    params: { cateId, date },
  });
};
