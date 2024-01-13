<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToNamespace"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>

        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Namespace({{ data.name }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 20px"></div>

    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="YAML" name="second"></el-tab-pane>
    </el-tabs>
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

  namespace: '',

  activeName: 'second',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;

  await getNamespace();
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

const getNamespace = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.name}`,
    });
    data.namespace = res;

    data.yaml = jsYaml.dump(data.namespace);
  } catch (error) {}
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div
        class="pixiu-table-formatter"
        style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
      >
        {time}
      </div>
    </el-tooltip>
  );
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const goToNamespace = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/namespaces', query: queryParams });
};

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.namespace-tab {
  margin-top: 1px;
  margin-bottom: -32px;
}
</style>
