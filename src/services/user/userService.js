import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createUser = async (data, init) => {
  let url = '/pixiu/users';
  if (init) {
    url = url + '?initAdmin=true';
  }
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: url,
      data: data,
    }),
  );
  return [result, err];
};

export const getUserCount = async () => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/pixiu/users?count=true',
    }),
  );

  return [result, err];
};
