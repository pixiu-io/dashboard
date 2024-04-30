<template>
  <dev class="one-line-style">
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

      <div style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="集群名称" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px">
            {{ data.clusterForm.alias_name }}
          </span>
        </el-form-item>

        <el-form-item label="集群ID" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 60px; margin-top: 10px">
            {{ data.clusterForm.name }}
          </span>
        </el-form-item>

        <el-form-item label="部署类型" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 标准集群 </span>
        </el-form-item>
        <el-form-item label="状态" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px">
            <div class="pixiu-table-formatter">
              <el-space>
                <div class="color-green-word">运行中</div>
              </el-space>
            </div>
          </span>
        </el-form-item>
        <el-form-item label="所在地域" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="新增资源所属项目" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="集群规格" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="Kubernetes版本" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px">
            {{ data.clusterForm.kubernetes_version }}
          </span>
        </el-form-item>
        <el-form-item label="运行时组件" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="集群描述" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="貔貅云标签" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="删除保护" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="数据加密" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="ServiceAccountlssuerDiscovery" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
        <el-form-item label="创建时间" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px"> 0000 </span>
        </el-form-item>
      </div>
    </el-card>
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
        </el-form-item>

        <div style="margin-top: -12px"></div>

        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">集群ID </span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 54px">
            {{ data.clusterForm.name }}
          </span>
        </el-form-item>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">API地址 </span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 47px">
            {{ data.apiServer }}
          </span>
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
              <el-space>
                <div class="color-green-word">运行中</div>
              </el-space>
            </div>
          </span>
        </el-form-item>

        <div style="margin-top: -12px"></div>
        <el-form-item>
          <template #label>
            <span style="margin-left: 6px; font-size: 13px; color: #606266">集群规模 </span>
          </template>
          <span class="detail-card-style-form2" style="margin-left: 44px"> 10 节点 </span>
        </el-form-item>
      </div>
    </el-card>
  </dev>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';
import { getClustersById } from '@/services/cloudService';
import { runningFormatter } from '@/utils/formatter';
import { getConfigMap } from '@/services/kubernetes/configmapService';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

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

  apiServer: '',
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterId = localStorage.getItem('clusterId');

  getCluster();
  GetConfigMap();
});

const getCluster = async () => {
  const [err, result] = await getClustersById(data.clusterId);
  if (err) {
    return;
  }
  data.clusterForm = result;
};

const GetConfigMap = async () => {
  const [result, err] = await getConfigMap(data.cluster, 'kube-system', 'kubeadm-config');
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  let s = [];
  data.configData = result.data.ClusterConfiguration;
  for (let p of data.configData.split('\n')) {
    if (p === '') {
      continue;
    }
    if (p.includes('controlPlaneEndpoint')) {
      const endpoints = p.split('controlPlaneEndpoint: ');
      if (endpoints.length === 2) {
        data.apiServer = 'https://' + endpoints[1];
      }
    } else {
      s.push(p);
    }
  }
  const d = s.join('\n');
};
</script>

<style>
.content1-card-container {
  height: 600px;
  width: 60%;
  margin-top: 5px;
  margin-left: 5px;
  border-radius: 0px;
}

.content2-card-container {
  height: 329px;
  width: 40%;
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
</style>
