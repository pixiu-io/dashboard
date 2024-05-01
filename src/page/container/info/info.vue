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

      <!-- <el-card> </el-card>
      <el-card> </el-card> -->

      <div style="margin-top: 8px; width: 100%; border-radius: 0px"></div>
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
                  <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color="#28C65A" />
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
import { copy } from '@/utils/utils';
import jsYaml from 'js-yaml';

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

  configData: {
    controlPlaneEndpoint: '',
    networking: {},
  },
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

  const cd = result.data.ClusterConfiguration;
  const jsData = jsYaml.load(cd);

  data.configData.controlPlaneEndpoint = 'https://' + jsData.controlPlaneEndpoint;
  data.configData.networking = jsData.networking;
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
