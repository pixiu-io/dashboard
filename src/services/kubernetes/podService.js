import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const deletePod = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
    }),
  );
  return [result, err];
};
