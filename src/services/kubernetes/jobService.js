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

export const reRunJob = async (cluster, namespace, name, resourceVersion) => {
  const [result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/kubeproxy/clusters/${cluster}/namespaces/${namespace}/jobs/${name}?resourceVersion=${resourceVersion}&action=rerun`,
    }),
  );
  return [result];
};

export const getJobList = async (cluster, namespace, params) => {
  let url = `/pixiu/indexer/clusters/${cluster}/resources/job/namespaces/${namespace}`;
  if (namespace === '全部空间') {
    url = `/pixiu/indexer/clusters/${cluster}/resources/job/namespaces/all_namespaces`;
  }

  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: params,
    }),
  );
  return [result, err];
};
