import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createDeployment = async (data, cloud_name, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/clouds/apps/v1/${cloud_name}/namespaces/${namespace}/deployments/${name}`,
      data,
    }),
  );
  return [err, result];
};
