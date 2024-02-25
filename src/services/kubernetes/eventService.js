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

export const deleteEvent = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/events/${name}`,
    }),
  );
  return [result, err];
};
