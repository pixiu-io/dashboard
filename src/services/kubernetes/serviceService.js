import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getServiceList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services`,
    }),
  );
  return [result, err];
};

export const updateService = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getService = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services/${name}`,
    }),
  );
  return [result, err];
};

export const deleteService = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services/${name}`,
    }),
  );
  return [result, err];
};

export const createService = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services`,
      data: data,
    }),
  );
  return [result, err];
};
