import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getIngressList = async (cluster, namespace) => {
  let url = `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/ingresses`;
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

export const createIngress = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`,
      data: data,
    }),
  );
  return [result, err];
};

export const deleteIngress = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`,
    }),
  );
  return [result, err];
};

export const updateIngress = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getIngress = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`,
    }),
  );
  return [result, err];
};
