import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getNamespaceList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces`,
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
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${name}`,
    }),
  );
  return [result, err];
};
