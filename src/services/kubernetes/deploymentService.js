import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const getDeployment = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
    }),
  );
  return [result, err];
};

export const updateDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
      data,
    }),
  );
  return [result, err];
};
