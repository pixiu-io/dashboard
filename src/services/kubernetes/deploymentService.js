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
  let url = `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/apis/apps/v1/deployments`;
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

export const patchDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
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

export const rolloBackDeployment = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'patch',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
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
export const getDeployReady = (deploy) => {
  let availableReplicas = deploy.status.availableReplicas;
  if (availableReplicas === undefined) {
    availableReplicas = 0;
  }

  return availableReplicas + '/' + deploy.spec.replicas;
};
