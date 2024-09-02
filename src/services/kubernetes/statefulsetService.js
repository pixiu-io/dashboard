import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createStatefulSet = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets`,
      data: data,
    }),
  );
  return [result, err];
};

export const getStatefulSet = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
    }),
  );
  return [result, err];
};

export const updateStatefulSet = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const deleteStatefulSet = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`,
    }),
  );
  return [result, err];
};

export const getStatefulSetList = async (cluster, namespace, params) => {
  // let url = `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/statefulsets`;
  // if (namespace === '全部空间') {
  //   url = `/pixiu/proxy/${cluster}/apis/apps/v1/statefulsets`;
  // }
  let url = `/pixiu/indexer/clusters/${cluster}/resources/deployment/namespaces/${namespace}`;
  if (namespace === '全部空间') {
    url = `/pixiu/indexer/clusters/${cluster}/resources/deployment/namespaces/all_namespaces`;
  }
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: params,
    }),
  );
  return [result, err];
};
