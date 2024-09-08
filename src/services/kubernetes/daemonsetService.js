import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createDaemonset = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets`,
      data: data,
    }),
  );
  return [result, err];
};

export const getDaemonset = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`,
    }),
  );
  return [result, err];
};

export const updateDaemonset = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const deleteDaemonset = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`,
    }),
  );
  return [result, err];
};

export const getDaemonsetList = async (cluster, namespace, params) => {
  // let url = `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets`;
  // if (namespace === '全部空间') {
  //   url = `/pixiu/proxy/${cluster}/apis/apps/v1/daemonsets`;
  // }
  let url = `/pixiu/indexer/clusters/${cluster}/resources/daemonset/namespaces/${namespace}`;
  if (namespace === '全部空间') {
    url = `/pixiu/indexer/clusters/${cluster}/resources/daemonset/namespaces/all_namespaces`;
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

export const patchDaemonset = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`,
      data: data,
      config: {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    }),
  );

  return [result, err];
};

export const rolloBackDaemonset = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`,
      data: data,
      config: {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      },
    }),
  );

  return [result, err];
};

export const getDaemonsetReady = (deploy) => {
  let status = deploy.status;
  return (
    status.numberReady +
    '/' +
    status.updatedNumberScheduled +
    '/' +
    (status.numberUnavailable ? status.numberUnavailable : 0)
  );
};
