import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const loginMethod = async (data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: '/pixiu/users/login',
      data,
    }),
  );
  return [err, result];
};

export const logoutMethod = async (uid) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/users/${uid}/logout`,
    }),
  );
  return [err, result];
};
