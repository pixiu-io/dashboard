import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getTaskList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};
