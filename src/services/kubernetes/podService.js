import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getPodList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`,
      data: {
        limit: 500,
      },
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

export const getPodLogs = async (cluster, namespace, name, container) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/log`,
      data: { container: container },
    }),
  );
  return [result, err];
};
