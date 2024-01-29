<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToNode"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>

        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Node:{{ data.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  activeName: 'five',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;

  await GetNode();
});

const { toClipboard } = useClipboard();
const copyYmal = async () => {
  try {
    await toClipboard(data.yaml);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const GetNode = async () => {
  try {
  } catch (error) {}
};

const goToNode = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/nodes', query: queryParams });
};
</script>

<style scoped="scoped"></style>
