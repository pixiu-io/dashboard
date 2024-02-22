import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getReleaseList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/helms/clusters/${cluster}/v1/namespaces/${namespace}/releases`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};
