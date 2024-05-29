<template>
  <div class="one-line-style">
    <div style="display: flex; flex-direction: column; width: 60%">
      <el-card class="content1-card-container">
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 2px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          集群概览
        </div>

        <el-card class="content4-card-container" style="margin-top: 20px">
          <div
            style="
              text-align: left;
              font-weight: bold;
              padding-left: 5px;
              margin-top: 2px;
              font-size: 14px;
              color: #191919;
            "
          >
            <pixiu-icon name="icon-xingzhuang" size="26px" type="iconfont" color="#006eff" />
            CPU状态
          </div>

          <div style="display: flex; flex-direction: row; margin-top: 15px; margin-left: 15px">
            <div style="font-size: 16px; color: #191919">
              <div>{{ data.nodeData.resources.capacity.cpu }}</div>
              <div style="font-size: 13px; color: #29232b">总计</div>
            </div>
            <div style="margin-left: 30%; font-size: 15px; color: #191919">
              <div>{{ data.nodeData.resources.used.cpu }}</div>
              <div style="font-size: 13px; color: #29232b">已使用</div>
            </div>
            <div style="margin-left: 30%; font-size: 15px; color: #28c65a">
              <div>{{ data.nodeData.resources.usage.cpu }}</div>
              <div style="font-size: 13px; color: #29232b">使用率</div>
            </div>
          </div>
        </el-card>

        <el-card class="content4-card-container">
          <div
            style="
              text-align: left;
              font-weight: bold;
              padding-left: 5px;
              margin-top: 2px;
              font-size: 14px;
              color: #191919;
            "
          >
            <pixiu-icon name="icon-memory-card-one" size="26px" type="iconfont" color="#006eff" />
            内存状态
          </div>

          <div style="display: flex; flex-direction: row; margin-top: 15px; margin-left: 15px">
            <div style="font-size: 16px; color: #191919">
              <div>{{ data.nodeData.resources.capacity.memory }}</div>
              <div style="font-size: 13px; color: #29232b">总计</div>
            </div>
            <div style="margin-left: 30%; font-size: 15px; color: #191919">
              <div>{{ data.nodeData.resources.used.memory }}</div>
              <div style="font-size: 13px; color: #29232b">已使用</div>
            </div>
            <div style="margin-left: 30%; font-size: 15px; color: #28c65a">
              <div>{{ data.nodeData.resources.usage.memory }}</div>
              <div style="font-size: 13px; color: #29232b">使用率</div>
            </div>
          </div>
        </el-card>
      </el-card>

      <el-card class="content1-card-container" style="height: 385px">
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 2px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          监控分析
        </div>
        <el-empty description="" />
      </el-card>
    </div>
    <div style="display: flex; flex-direction: column; width: 40%">
      <el-card class="content2-card-container">
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 2px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          基本信息
        </div>

        <div style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">名称 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 65px">
              {{ data.clusterForm.alias_name }}
            </span>
            <div style="margin-left: 8px; cursor: pointer">
              <pixiu-icon name="icon-edit" size="12px" type="iconfont" color="#909399" />
            </div>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">集群ID </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 54px">
              {{ data.clusterForm.name }}
            </span>
            <div style="margin-left: 8px; cursor: pointer">
              <pixiu-icon
                name="icon-copy"
                size="12px"
                type="iconfont"
                color="#909399"
                @click="copy(data.clusterForm.name)"
              />
            </div>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">API地址 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 47px">
              {{ data.configData.controlPlaneEndpoint }}
            </span>
            <div style="margin-left: 8px; cursor: pointer">
              <pixiu-icon
                name="icon-copy"
                size="12px"
                type="iconfont"
                color="#909399"
                @click="copy(data.configData.controlPlaneEndpoint)"
              />
            </div>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">类型 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 67px">
              <el-tag type="primary">标准集群</el-tag>
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266"> 集群版本 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 44px">
              {{ data.clusterForm.kubernetes_version }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">集群状态 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 44px">
              <div class="pixiu-table-formatter">
                <div style="display: flex">
                  <div>
                    <pixiu-icon
                      name="icon-circle-dot"
                      size="12px"
                      type="iconfont"
                      color="#28C65A"
                    />
                  </div>
                  <div style="margin-left: 6px">运行中</div>
                </div>
              </div>
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">集群规模 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 44px">
              {{ data.nodeData.count }} 节点
            </span>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="content2-card-container" style="height: 250px">
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 2px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          网络信息
        </div>

        <div style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #606266">CNI</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 96px">
              <el-tag type="primary">flannel</el-tag>
            </span>
          </el-form-item>
        </div>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">服务网络</span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 67px">
            {{ data.configData.networking.serviceSubnet }}
          </span>
        </el-form-item>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">容器网络</span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 67px">
            {{ data.configData.networking.podSubnet }}
          </span>
        </el-form-item>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">DNS域</span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 80px">
            {{ data.configData.networking.dnsDomain }}
          </span>
          <div style="margin-left: 8px; cursor: pointer">
            <pixiu-icon
              name="icon-copy"
              size="12px"
              type="iconfont"
              color="#909399"
              @click="copy(data.configData.networking.dnsDomain)"
            />
          </div>
        </el-form-item>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">转发模式</span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 68px">
            {{ data.configData.mode }}
          </span>
        </el-form-item>
      </el-card>

      <el-card class="content2-card-container" style="height: 200px">
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 2px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          集群服务
        </div>

        <div style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #22ad44; font-weight: bold"
                >Kubernetes control plane</span
              >
            </template>
            is running
          </el-form-item>
          <div style="margin-top: -20px"></div>

          <el-form-item>
            <template #label>
              <span style="margin-left: 6px; font-size: 13px; color: #22ad44; font-weight: bold"
                >CoreDNS</span
              >
            </template>
            is running
          </el-form-item>
        </div>
        <div style="margin-top: -20px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #22ad44; font-weight: bold"
              >MetricsServer</span
            >
          </template>
          is running
        </el-form-item>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';
import { getClustersById } from '@/services/cloudService';
import { runningFormatter } from '@/utils/formatter';
import { getConfigMapContent } from '@/services/kubernetes/configmapService';
import { copy } from '@/utils/utils';
import { getNodeList, getNodeMetrics } from '@/services/kubernetes/nodeService';
import { getServicesByLabels } from '@/services/kubernetes/serviceService';

const { proxy } = getCurrentInstance();

const data = reactive({
  cluster: '',
  clusterId: 0,
  clusterForm: {
    name: '',
    alias_name: '',
    cluster_type: '',
    protected: true,
    kubernetes_version: '',
    gmt_create: '',
  },

  configData: {
    controlPlaneEndpoint: '',
    networking: {},
    mode: 'iptables',
  },

  clusterService: {
    kubernetes: true,
    coredns: true,
    metricsServer: true,
  },

  nodeData: {
    count: 0,
    resources: {
      capacity: {
        cpu: '',
        memory: '',
      },
      usage: {
        cpu: '',
        memory: '',
      },
      used: {
        cpu: '',
        memory: '',
      },
    },
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterId = localStorage.getItem('clusterId');

  getCluster();
  GetConfigMap();
  GetProxyConfig();
  GetNodesAndMetrics();
  getClusterServices();
});

const getCluster = async () => {
  const [err, result] = await getClustersById(data.clusterId);
  if (err) {
    return;
  }
  data.clusterForm = result;
};

const GetConfigMap = async () => {
  const [cfg, err] = await getConfigMapContent(
    data.cluster,
    'kube-system',
    'kubeadm-config',
    'ClusterConfiguration',
  );
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  data.configData.controlPlaneEndpoint = 'https://' + cfg.controlPlaneEndpoint;
  data.configData.networking = cfg.networking;
};

const GetProxyConfig = async () => {
  const [cfg, err] = await getConfigMapContent(
    data.cluster,
    'kube-system',
    'kube-proxy',
    'config.conf',
  );
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  if (cfg.mode !== 'iptables' && cfg.mode !== '') {
    data.configData.mode = cfg.mode;
  }
};

const getClusterServices = async () => {
  const [service, err] = await getServicesByLabels(data.cluster, [
    'kubernetes.io/cluster-service=true',
  ]);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
};

const GetNodesAndMetrics = async () => {
  const [nodes, err1] = await getNodeList(data.cluster);
  if (err1) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.nodeData.count = nodes.items.length;

  let cpuTotal = 0;
  let memoryTotal = 0;
  for (let node of nodes.items) {
    const cap = node.status.capacity;
    // cpu 累加，单位为核
    cpuTotal += parseInt(cap.cpu);
    // 内存累加，单位为 Ki
    const parts = cap.memory.split('Ki');
    if (parts.length === 2) {
      memoryTotal += parseFloat(parts[0]);
    }
  }

  const [metrics, err2] = await getNodeMetrics(data.cluster);
  if (err2) {
    proxy.$message.error(err.response.data.message);
  }

  let cpuUsage = 0;
  let memoryUsage = 0;
  for (let no of metrics.items) {
    const usage = no.usage;
    const cpuP = usage.cpu.split('n');
    if (cpuP.length === 2) {
      cpuUsage += parseFloat(cpuP[0]);
    }
    const memP = usage.memory.split('Ki');
    if (memP.length === 2) {
      memoryUsage += parseFloat(memP[0]);
    }
  }

  data.nodeData.resources = {
    capacity: {
      cpu: cpuTotal + ' Cores',
      memory: Math.round((memoryTotal / 1024 / 1024) * 100) / 100 + ' GiB',
    },
    used: {
      cpu: Math.round((cpuUsage / 1000 / 1000 / 1000) * 100) / 100 + ' Cores',
      memory: Math.round((memoryUsage / 1024 / 1024) * 100) / 100 + ' GiB',
    },
    usage: {
      cpu: Math.round((cpuUsage / (cpuTotal * 1000000000)) * 10000) / 100 + '%',
      memory: Math.round((memoryUsage / memoryTotal) * 10000) / 100 + '%',
    },
  };
};
</script>

<style>
.content1-card-container {
  height: 400px;
  /* width: 60%; */
  margin-top: 5px;
  margin-left: 5px;
  border-radius: 0px;
}

.content2-card-container {
  height: 329px;
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 0px;
}

.content3-card-container {
  height: 380px;
  width: 98.5%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}

.content4-card-container {
  height: 140px;
  width: 96%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}
</style>
