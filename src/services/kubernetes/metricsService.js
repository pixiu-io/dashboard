import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getPodCpuUsageMetrics = async (cluster, namespace, pods) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/metrics.pixiu.io/v1beta1/api/v1/dashboard/namespaces/${namespace}/pod-list/${pods}/metrics/cpu/usage_rate`,
    }),
  );
  return [result, err];
};

export const getPodMemoryUsageMetrics = async (cluster, namespace, pods) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/metrics.pixiu.io/v1beta1/api/v1/dashboard/namespaces/${namespace}/pod-list/${pods}/metrics/memory/usage_rate`,
    }),
  );
  return [result, err];
};

export const getNodeUsageMetrics = async (cluster, name, metricsName, whatever) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/apis/metrics.pixiu.io/v1beta1/api/v1/dashboard/nodes/${name}/metrics/${metricsName}/${whatever}`,
    }),
  );
  return [result, err];
};
