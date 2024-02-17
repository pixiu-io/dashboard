import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getSecretList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/secrets`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};

export const updateSecret = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/secrets/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getSecret = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/secrets/${name}`,
    }),
  );
  return [result, err];
};

export const deleteSecret = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/secrets/${name}`,
    }),
  );
  return [result, err];
};

export const createSecret = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/secrets`,
      data: data,
    }),
  );
  return [result, err];
};
