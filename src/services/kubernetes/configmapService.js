import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';
import jsYaml from 'js-yaml';

export const getConfigmapList = async (cluster, namespace) => {
  let url = `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/configmaps`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/api/v1/configmaps`;
  }

  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const updateConfigMap = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/configmaps/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getConfigMap = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/configmaps/${name}`,
    }),
  );
  return [result, err];
};

export const deleteConfigMap = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/configmaps/${name}`,
    }),
  );
  return [result, err];
};

export const createConfigMap = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/configmaps`,
      data: data,
    }),
  );
  return [result, err];
};

// 获取 cm 的配置内容，并直接转成成 object 返回
export const getConfigMapContent = async (cluster, namespace, name, key) => {
  const [result, err] = await getConfigMap(cluster, namespace, name);
  if (err) {
    return [result, err.response.data.message];
  }
  try {
    const config = result.data[key];
    const jsData = jsYaml.load(config);
    return [jsData, null];
  } catch (e) {
    return ['', e];
  }
};
