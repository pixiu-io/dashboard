import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getIngressList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`,
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
      url: `/proxy/pixiu/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`,
      data: data,
    }),
  );
  return [result, err];
};

export const deleteIngress = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`,
    }),
  );
  return [result, err];
};

export const updateIngress = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`,
      data: data,
    }),
  );
  return [result, err];
};
