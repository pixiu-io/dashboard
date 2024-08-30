import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getDeploymentReplicasets = async (cluster, namespace, labels) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/replicasets?labelSelector=${labels}`,
    }),
  );
  return [result, err];
};
export const getDaemonsetReplicasets = async (cluster, namespace, labels) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `pixiu/proxy/${cluster}/apis/apps/v1/namespaces/${namespace}/replicasets?labelSelector=${labels}`,
    }),
  );
  return [result, err];
};
