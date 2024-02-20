import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getNodeList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/nodes`,
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
      url: `/proxy/pixiu/${cluster}/api/v1/nodes/${name}`,
    }),
  );
  return [result, err];
};
