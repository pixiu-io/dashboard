import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getIngressList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`,
    }),
  );
  return [err, result];
};
