import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createDeployment = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments`,
      data: data,
    }),
  );
  return [result, err];
};

export const getDeployment = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
    }),
  );
  return [result, err];
};

export const updateDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const deleteDeployment = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
    }),
  );
  return [result, err];
};

export const getDeploymentList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const patchDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
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
