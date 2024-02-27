import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getEventList = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/kubeproxy/clusters/${cluster}/namespaces/${namespace}/name/${name}/kind/deployment/events`,
    }),
  );

  return [result.items, err];
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

export const getRawEventList = async (cluster, uid, name, namespace, kind) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/events`,
      data: {
        fieldSelector: `involvedObject.uid=${uid},involvedObject.name=${name},involvedObject.namespace=${namespace},involvedObject.kind=${kind}`,
        limit: 500,
      },
    }),
  );

  return [result.items, err];
};
