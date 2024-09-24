import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getNamespaceList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getNamespace = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${name}`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const deleteNamespace = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${name}`,
    }),
  );
  return [result, err];
};

export const getNamespaceNames = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces`,
      data: {
        limit: 500,
      },
    }),
  );

  let namespaces = [];
  for (let item of result.items) {
    namespaces.push(item.metadata.name);
  }

  return [namespaces, err];
};

export const createNamespace = async (cluster, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces`,
      data: data,
    }),
  );
  return [result, err];
};

export const getLocalNamespace = () => {
  const ns = localStorage.getItem('namespace');
  if (ns) {
    return ns;
  }

  return 'default';
};

export const getQuotaList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/resourcequotas`,
      data: { limit: 1 },
    }),
  );
  return [result, err];
};
