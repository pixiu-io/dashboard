import { ElMessage } from 'element-plus';
import axios from 'axios';
// import { router } from '@/router/index';

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

    // TODO: 后续优化
    if (config.method === 'patch') {
      config.headers['Content-Type'] = 'application/merge-patch+json';
    } else {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 返回结果中间件
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 200) {
      return data.result;
    } else if (typeof data.code === 'undefined') {
      return data;
    } else {
      ElMessage({
        message: data.message,
        type: 'error',
      });

      if (data.code === 401) {
        localStorage.clear();
        location.href('/login');
      }
      return Promise.reject(data);
    }
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error',
    });

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
  if (method === 'patch') {
    return instance.patch(url, data, { ...config });
  }
  // console.error(`UnKnown Method:${method}`);
  return false;
};

export default axiosIntance;
