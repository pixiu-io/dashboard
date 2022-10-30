import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getClouds = async (data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/clouds',
      data,
    }),
  );
  return [err, result];
};

export const deleteCloudById = async (id) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/clouds/${id}`,
    }),
  );
  return [err, result];
};
