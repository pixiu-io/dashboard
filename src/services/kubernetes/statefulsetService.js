import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createStatefulSet = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets`,
      data: data,
    }),
  );
  return [result, err];
};

export const getStatefulSet = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
    }),
  );
  return [result, err];
};

export const updateStatefulSet = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const deleteStatefulSet = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
    }),
  );
  return [result, err];
};

export const getStatefulSetList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};
