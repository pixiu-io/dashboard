import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const createJob = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/batch/v1/namespaces/${namespace}/jobs`,
      data: data,
    }),
  );
  return [result, err];
};

export const getJob = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/batch/v1/namespaces/${namespace}/jobs/${name}`,
    }),
  );
  return [result, err];
};

export const updateJob = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/batch/v1/namespaces/${namespace}/jobs/${name}`,
      data,
    }),
  );
  return [result, err];
};

export const deleteJob = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/batch/v1/namespaces/${namespace}/jobs/${name}`,
    }),
  );
  return [result, err];
};

export const getJobList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/batch/v1/namespaces/${namespace}/jobs`,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};
