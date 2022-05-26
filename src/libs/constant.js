/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2020-11-23 11:16:15
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2022-05-26 09:33:20
 */
import config from '@/config';

// 原本是window.location.origin !== 'https://shandianyun-sck.iqilu.com' 但是不光素材库模块使用当前插件
export const isTestENV = !window.location.origin.includes('https://shandianyun');

export const SUCAI_URL = isTestENV ? config.sucaiUrl.dev : config.sucaiUrl.prod;
export const ARTICLE_URL = isTestENV ? config.articleUrl.dev : config.articleUrl.prod;
export const SERIES_URL = isTestENV ? config.seriesUrl.dev : config.seriesUrl.prod;
