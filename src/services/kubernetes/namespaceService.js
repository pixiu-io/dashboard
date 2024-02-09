import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getNamespaceList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces`,
    }),
  );
  return [err, result];
};
