<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToPod"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>

        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Pod:{{ data.name }}({{ data.namespace }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="GetPod">刷新</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">删除</button>
        <!-- <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">查看YAML</button> -->
      </el-col>
    </el-row>
  </div>

  <el-card class="contend-card-container2">
    <div v-if="data.pod" style="margin-top: 6px; width: 100%; border-radius: 0px">
      <el-descriptions
        style="margin-left: 8px"
        class="margin-top"
        title="基本信息"
        :column="3"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">名称</div>
          </template>
          {{ data.pod.metadata.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">命名空间</div>
          </template>
          {{ data.pod.metadata.namespace }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">QoS类别</div>
          </template>
          {{ data.pod.status.qosClass }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">所在节点</div>
          </template>
          {{ data.pod.spec.nodeName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">实例IP</div>
          </template>
          {{ data.pod.status.podIP }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">状态</div>
          </template>
          Running
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">重启次数</div>
          </template>
          0
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">创建时间</div>
          </template>
          {{ data.pod.metadata.creationTimestamp }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">镜像</div>
          </template>
          nginx
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="容器" name="first"> </el-tab-pane>
      <el-tab-pane label="元数据" name="second"> </el-tab-pane>
      <el-tab-pane label="环境变量" name="third"> </el-tab-pane>
      <el-tab-pane label="监控" name="four"></el-tab-pane>
      <el-tab-pane label="事件" name="five"></el-tab-pane>
      <el-tab-pane label="YAML" name="six"></el-tab-pane>
    </el-tabs>
  </el-card>

  <el-card class="contend-card-container2"> </el-card>
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
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  await GetPod();
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

const GetPod = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.name}`,
    });
    data.pod = res;

    data.yaml = jsYaml.dump(data.pod);
  } catch (error) {}
};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
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

const goToPod = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/pods', query: queryParams });
};

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.namespace-tab {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: -32px;
}

.namespace-detail-info {
  font-size: 13px;
  color: #29232b;
}

.namespace-info {
  font-size: 13px;
  margin-left: 10px;
  color: #29232b;
}
</style>
