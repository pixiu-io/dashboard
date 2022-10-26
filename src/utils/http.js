import { ElMessage } from 'element-plus';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 如果后端开放了cors，就可以用这个替代上面一行
  timeout: 6000, // 设置超时时间1分钟
  header: {
    'Content-Type': 'application/json;charset=UTF-8', // 基础的请求头
  },
});

// 请求中间件
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = `Bearer ${token}`); // 如果localstorage存在token则将token直接写入headers
    if (config.method === 'POST') {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 返回结果中间件
instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    switch (res.code) {
      case 401:
        ElMessage({
          message: res.message,
          type: 'error',
        });
        localStorage.clear();
        // 跳转到登陆界面
        // TODO: 跳转异常，需要处理
        router.push('/');
        break;

      default:
        return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

const axiosIntance = ({ method, url, data, config }) => {
  method = method.toLowerCase();
  if (method === 'post') {
    return instance.post(url, data, { ...config });
  }
  if (method === 'get') {
    return instance.get(url, { params: data, ...config });
  }
  if (method === 'delete') {
    return instance.delete(url, { params: data, ...config });
  }
  if (method === 'put') {
    return instance.put(url, data, { ...config });
  }
  console.error(`UnKnown Method:${method}`);
  return false;
};

export default axiosIntance;
