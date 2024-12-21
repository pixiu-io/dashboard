<template>
  <div style="display: flex">
    <pixiu-icon
      name="icon-back"
      style="cursor: pointer"
      size="16px"
      type="iconfont"
      color="#006eff"
      @click="goToPod"
    />

    <div style="size: 14px; margin-left: 20px; margin-top: -4px">
      {{ data.name }}({{ data.namespace }})
    </div>
  </div>

  <el-card class="contend-card-container2">
    <el-col>
      <div style="float: right; height: 50px">
        <button class="pixiu-two-button" @click="GetPod">刷新</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">监控</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">日志</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">删除</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">查看YAML</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">远程登陆</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
          更多操作
        </button>
      </div>
    </el-col>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器状态" name="second"> </el-tab-pane>
      <el-tab-pane label="元数据" name="third"> </el-tab-pane>
      <el-tab-pane label="监控指标" name="four"></el-tab-pane>
      <el-tab-pane label="环境变量" name="five"></el-tab-pane>
      <el-tab-pane label="事件" name="six"></el-tab-pane>
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
  namespace: '',
  name: '',

  pod: '',
  podLogs: [],

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  activeName: 'first',

  yaml: '',
  yamlName: '',
  readOnly: true,

  card: true,

  containerMap: {},
  containerStatusMap: {},
  createTime: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  await GetPod();
});

const GetPod = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.name}`,
    });
    data.pod = res;
    data.yaml = jsYaml.dump(data.pod, { quotingType: '"' });
    data.createTime = formatTimestamp(data.pod.metadata.creationTimestamp);

    data.containerMap = {};
    for (let c of data.pod.spec.containers) {
      data.containerMap[c.name] = c;
    }
    data.containerStatusMap = {};
    for (let cs of data.pod.status.containerStatuses) {
      data.containerStatusMap[cs.name] = cs;
    }

    initItems();
  } catch (error) {}
};

const initItems = () => {};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const goToPod = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/pods', query: queryParams });
};
</script>
