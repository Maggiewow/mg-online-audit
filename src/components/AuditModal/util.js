/*
 * @文件描述:
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-05-26 16:21:08
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-06-18 17:39:39
 */
import moment from "moment";

/**
 * 获取 blob
 * url 目标文件地址
 */
function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };

    xhr.send();
  });
}

/**
 * 保存 blob
 * filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    const body = document.querySelector("body");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * 下载 线上环境才可调用？？
 * @param {String} url 目标文件地址
 * @param {String} filename 想要保存的文件名称
 */
export const downloadVideo = (url, filename) => {
  console.log("下载url", url);
  getBlob(url).then(blob => {
    console.log("getBlob", blob);
    saveAs(blob, filename);
  });
};

// base64转blob
const base64ToBlob = function(base64Data, type) {
  let arr = base64Data.split(","),
    // fileType = arr[0].match(/:(.*?);/)[1],
    fileType = type || arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    l = bstr.length,
    u8Arr = new Uint8Array(l);
  console.log("图片类型", type, fileType);
  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8Arr], {
    type: fileType
  });
};

// blob转file
const blobToFile = function(newBlob, fileName) {
  newBlob.lastModifiedDate = new Date();
  newBlob.name = fileName;
  return newBlob;
};

// base64转file
export const setBase64toFile = (base, name, fileType) => {
  // 调用
  const blob = base64ToBlob(base, fileType);
  const file = blobToFile(blob, name);

  return file;
};
/** * 将秒转换为 分:秒 * s int 秒数 */
export const s_to_hs = s => {
  let isMinus = false;
  if (s < 0) {
    isMinus = true;
    s = Math.abs(s);
  }
  let h = Math.floor(s / 60 / 60);
  let m = Math.floor((s / 60) % 60);
  s = s % 60;
  h += "";
  m += "";
  s += "";
  h = h.length == 1 ? "0" + h : h;
  m = m.length == 1 ? "0" + m : m;
  s = s.length == 1 ? "0" + s : s;
  let result = h + ":" + m + ":" + s;
  if (isMinus) {
    result = "-" + result;
  }
  return result;
};

// 计算百分比
export const calcPercent = (currentSec, total) => {
  if (!currentSec) return "0%";

  let rate = ((currentSec / total) * 100).toFixed(2) + "%";

  return rate;
};

export const dateFormat = (date, pattern = "YYYY-MM-DD HH:mm:ss") => {
  if (!date) return "";

  if (date.length < 12) {
    date = date * 1000;
  }

  return moment(date).format(pattern);
};
