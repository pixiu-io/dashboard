import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getCRDList = async (cluster) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/apiextensions.k8s.io/v1/customresourcedefinitions`,
      data: {
        limit: 500,
      },
    }),
  );

  return [result, err];
};
