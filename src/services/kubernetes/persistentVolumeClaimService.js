import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getPersistentVolumeClaim = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`,
    }),
  );
  return [result, err];
};

export const getPersistentVolumeClaimList = async (cluster, namespace, params) => {
  let url = `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/persistentvolumeclaims`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/api/v1/persistentvolumeclaims`;
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
  return [result, err];
};
