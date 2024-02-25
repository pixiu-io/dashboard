import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getEventList = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/kubeproxy/clusters/${cluster}/namespaces/${namespace}/name/${name}/kind/deployment/events`,
    }),
  );
  return [result, err];
};

export const deleteEvent = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/deployments`,
      data: data,
    }),
  );
  return [result, err];
};
