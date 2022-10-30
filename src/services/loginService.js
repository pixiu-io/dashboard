import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const loginMethod = async (data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: '/users/login',
      data,
    }),
  );
  return [err, result];
};
