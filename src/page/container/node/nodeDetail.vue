<template>
  <div style="width: 100%">
    <el-card class="detail-card-style-header">
      <div style="width: 100%; background: #ffffff; display: flex; align-items: center">
        <pixiu-icon
          name="icon-back"
          style="cursor: pointer; margin-left: 4px"
          size="16px"
          type="iconfont"
          color="#006eff"
          @click="goToNode"
        />

        <el-breadcrumb separator="/" style="margin-left: 10px">
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> Node </span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            ><span class="breadcrumb-create-style"> Node详情 </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>

    <div class="detail-card-style-body">ddd</div>
  </div>
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { getNode } from '@/services/kubernetes/nodeService';

const { proxy } = getCurrentInstance();

const data = reactive({
  name: '',
  clusterName: '',
  cluster: '',

  nodeObject: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  await getNodeObject();
});

const getNodeObject = async () => {
  const [res, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }

  data.nodeObject = res;
};

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};
</script>

<style scoped="scoped"></style>
