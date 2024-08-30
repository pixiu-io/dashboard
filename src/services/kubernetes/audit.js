import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getAudits = async () => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/audits`,
    }),
  );
  return [result, err];
};
