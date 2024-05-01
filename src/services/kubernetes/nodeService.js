import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getNodeList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/nodes`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getNode = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/nodes/${name}`,
    }),
  );
  return [result, err];
};

export const drainNode = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/nodes/${name}`,
    }),
  );
  return [result, err];
};

export const patchNode = async (cluster, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/api/v1/nodes/${name}`,
      data: data,
      config: {
        header: {
          'Content-Type': 'application/strategic-merge-patch+json',
        },
      },
    }),
  );

  return [result, err];
};

export const getNodeMetrics = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/metrics.k8s.io/v1beta1/nodes`,
    }),
  );
  return [result, err];
};
