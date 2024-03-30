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
  return [result, err];
};

export const deleteTask = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`,
    }),
  );
  return [result, err];
};

export const updateTask = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/tasks/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

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
  return [result, err];
};

export const deleteTaskRun = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns/${name}`,
    }),
  );
  return [result, err];
};

export const updateTaskRun = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/taskruns/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPipelineList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};

export const getPipelineDetail = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines/${name}`,
    }),
  );
  return [result, err];
};

export const createPipeline = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines`,
      data: data,
    }),
  );
  return [result, err];
};

export const deletePipeline = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines/${name}`,
    }),
  );
  return [result, err];
};

export const updatePipeline = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines/${name}`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPipelineRunList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns`,
      data: { limit: 500 },
    }),
  );
  return [result, err];
};

export const getPipelineRunDetail = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns/${name}`,
    }),
  );
  return [result, err];
};

export const createPipelineRun = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns`,
      data: data,
    }),
  );
  return [result, err];
};

export const deletePipelineRun = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns/${name}`,
    }),
  );
  return [result, err];
};

export const updatePipelineRun = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns/${name}`,
      data: data,
    }),
  );
  return [result, err];
};
