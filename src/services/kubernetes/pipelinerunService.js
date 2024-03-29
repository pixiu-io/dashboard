import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

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
};

export const deletePipelineRun = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns/${name}`,
    }),
  );
};

export const updatePipelineRun = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelineruns/${name}`,
      data: data,
    }),
  );
};
