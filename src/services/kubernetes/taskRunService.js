import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getTaskRunList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};

export const getTaskRunDetail = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns/${name}`,
    }),
  );
  return [result, err];
};

export const createTaskRun = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns`,
      data: data,
    }),
  );
};

export const deleteTaskRun = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns/${name}`,
    }),
  );
};

export const updateTaskRun = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns/${name}`,
      data: data,
    }),
  );
};
