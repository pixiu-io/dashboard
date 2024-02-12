import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getStorageClassList = async (cluster, pageData) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/storage.k8s.io/v1/storageclasses`,
      data: pageData,
    }),
  );
  return [result, err];
};

export const getStorageClass = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/storage.k8s.io/v1/storageclasses/${name}`,
    }),
  );
  return [result, err];
};

export const updateStorageClass = async (cluster, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/apis/storage.k8s.io/v1/storageclasses/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const deleteStorageClass = async (cluster, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/proxy/pixiu/${cluster}/apis/storage.k8s.io/v1/storageclasses/${name}`,
    }),
  );
  return [result, err];
};

export const createStorageClass = async (cluster, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/proxy/pixiu/${cluster}/apis/storage.k8s.io/v1/storageclasses`,
      data: data,
    }),
  );
  return [result, err];
};
