<template>
  <el-card style="display: flex; flex-direction: column; width: 100%; height: 50px">
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
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
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
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  name: '',
  clusterName: '',
  cluster: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  await GetNode();
});

const GetNode = async () => {
  try {
  } catch (error) {}
};

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};
</script>

<style scoped="scoped"></style>
