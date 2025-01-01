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

export const getEventByResourceList = async (cluster, namespace, name, resource) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/kubeproxy/clusters/${cluster}/namespaces/${namespace}/name/${name}/kind/${resource}/events`,
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

export const deleteEventsInBatch = async (cluster, events) => {
  for (let event of events) {
    const [result, err] = await deleteEvent(cluster, event.namespace, event.name);
    if (err) {
      return err;
    }
  }
};

export const getRawEventList = async (cluster, uid, namespace, name, kind, namespaced) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/kubeproxy/clusters/${cluster}/api/v1/events`,
      data: {
        uid: uid,
        namespace: namespace,
        name: name,
        kind: kind,
        namespaced: namespaced,
        limit: 500,
      },
    }),
  );

  return [result.items, err];
};

// 获取指定命名空间的事件
export const getNamespaceEventList = async (cluster, namespace) => {
  let url = `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/events`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/api/v1/events`;
  }
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: {
        limit: 500,
      },
    }),
  );

  return [result.items, err];
};

export const getPodEventList = async (cluster, uid, namespace, name) => {
  return getRawEventList(cluster, uid, namespace, name, '', true);
};

export const getNodeEventList = async (cluster, uid, name) => {
  return getRawEventList(cluster, uid, '', name, 'Node', false);
};
