import { ElMessage } from 'element-plus';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

const awaitWrap = (promise) => {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
};
export { awaitWrap };

const padZero = (number) => {
  return number.toString().padStart(2, '0');
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDateTime = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
    date.getDate(),
  )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

  return formattedDateTime;
};
export { formatTimestamp };

const getTableData = (pageInfo, sourceData) => {
  const startIndex = (pageInfo.page - 1) * pageInfo.limit;
  const endIndex = Math.min(startIndex + pageInfo.limit, sourceData.length);
  // Use Array.slice() to extract the desired portion of sourceData
  return sourceData.slice(startIndex, endIndex);
};
export { getTableData };

const searchData = (pageInfo, sourceData) => {
  let filteredData = [];
  if (pageInfo.search.field === 'name') {
    filteredData = sourceData.filter((item) =>
      item.metadata.name.includes(pageInfo.search.searchInfo),
    );
  }
  pageInfo.total = filteredData.length;
  return getTableData(pageInfo, filteredData);
};

export { searchData };

const copy = async (val) => {
  try {
    await toClipboard(String(val));
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};
export { copy };

// 深度合并函数
export const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};

// 解析网络字符串
export const parseNetwork = (networkString) => {
  const [address, mask] = networkString.split('/');
  const [a_cidr, b_cidr, c_cidr, d_cidr] = address.split('.');
  return {
    a_cidr,
    b_cidr,
    c_cidr,
    d_cidr,
    mask,
  };
};

const getHeadersWithToken = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export { getHeadersWithToken };
