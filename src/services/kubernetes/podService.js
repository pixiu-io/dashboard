import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getPodList = async (cluster, namespace) => {
  let url = `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/api/v1/pods`;
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

export const getPod = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
    }),
  );
  return [result, err];
};

export const getPodByName = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
      data: {},
    }),
  );
  return [result, err];
};

export const deletePod = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
    }),
  );
  return [result, err];
};

export const createPod = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPodsByNode = async (cluster, nodeName) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/pods`,
      data: {
        fieldSelector: 'spec.nodeName=' + nodeName,
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getPodsByLabels = async (cluster, namespace, labels) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`,
      data: {
        labelSelector: labels,
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getPodLog = async (cluster, namespace, name, container, line) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/log`,
      data: {
        container: container,
        tailLines: line,
      },
    }),
  );
  return [result, err];
};
