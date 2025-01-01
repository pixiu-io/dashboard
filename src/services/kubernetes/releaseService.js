import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getReleaseList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/helms/clusters/${cluster}/namespaces/${namespace}/releases`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const deleteRelease = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/helms/clusters/${cluster}/namespaces/${namespace}/releases/${name}`,
    }),
  );
  return [result, err];
};

export const getRelease = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/helms/clusters/${cluster}/namespaces/${namespace}/releases/${name}`,
    }),
  );
  return [result, err];
};
