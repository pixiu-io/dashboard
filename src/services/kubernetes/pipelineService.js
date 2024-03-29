import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

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
};

export const deletePipeline = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines/${name}`,
    }),
  );
};

export const updatePipeline = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/pixiu/proxy/${cluster}/apis/tekton.dev/v1/namespaces/${namespace}/pipelines/${name}`,
      data: data,
    }),
  );
};
