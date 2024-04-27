<template>
  <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml title="基本信息" displayNamespace="false"></PiXiuYaml>
    </div>
  </div>

  <dev class="one-line-style">
    <el-card class="content1-card-container">
      <div>集群信息</div>
      <div style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="集群名称" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px">
            {{ data.clusterForm.alias_name }}
          </span>
        </el-form-item>

        <el-form-item label="集群ID" class="detail-card-style-form">
          <span class="detail-card-style-form2" style="margin-left: 90px">
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
    <el-card class="content2-card-container"> 集群资源使用情况</el-card>
  </dev>
  <div><el-card class="content3-card-container"> 核心组件状态</el-card></div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuCard from '@/components/card/index.vue';
import { getClustersById } from '@/services/cloudService';

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
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterId = localStorage.getItem('clusterId');
  getCluster();
});

const getCluster = async () => {
  const [err, result] = await getClustersById(data.clusterId);
  if (err) {
    return;
  }
  data.clusterForm = result;
};
</script>

<style>
.content1-card-container {
  height: 780px;
  width: 45%;
  margin-top: 25px;
  margin-left: 10px;
  border-radius: 0px;
}

.content2-card-container {
  height: 750px;
  width: 50%;
  margin-top: 25px;
  margin-left: 25px;
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
