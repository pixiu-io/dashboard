import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getAuditList = async (params) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/pixiu/audits',
      data: params,
    }),
  );

  return [result, err];
};
