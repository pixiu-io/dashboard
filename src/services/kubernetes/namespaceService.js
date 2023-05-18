import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const listNamespaces = async (cloud_name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'list',
      url: `/proxy/pixiu/${cloud_name}/api/v1/namespaces`,
    }),
  );
  return [err, result];
};
