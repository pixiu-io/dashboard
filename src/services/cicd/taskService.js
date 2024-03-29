import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getTaskList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};

export const getTaskDetail = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`,
    }),
  );
  return [result, err];
};

export const createTask = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks`,
      data: data,
    }),
  );
};

export const deleteTask = async (cluster, namespace, name) => {
  const [err, result] = awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`,
    }),
  );
};

export const updateTask = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`,
      data: data,
    }),
  );
};
