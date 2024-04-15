import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getClouds = async (data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: '/pixiu/clusters',
      data,
    }),
  );
  return [err, result];
};

export const deleteCloudById = async (id) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/clusters/${id}`,
    }),
  );
  return [err, result];
};

export const changeClustersAliasName = async (id, resource_version, alias_name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/clusters/${id}`,
      data: {
        resource_version: resource_version,
        alias_name: alias_name,
      },
    }),
  );

  return [err, result];
};

export const getClustersById = async (id) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/clusters/${id}`,
      data: {},
    }),
  );

  return [err, result];
};

export const changeClusterProtected = async (cid, resource_version, protect) => {
  let data = {
    resource_version: resource_version,
  };
  if (protect) {
    data['protected'] = protect;
  }

  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/clusters/protect/${cid}`,
      data: data,
    }),
  );

  return [err, result];
};
