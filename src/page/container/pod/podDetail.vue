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
          ><span class="breadcrumb-style">Pod({{ data.name }})</span>
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

  <div v-if="data.activeName === 'first'">
    <el-card class="contend-card-container2">
      <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>
      <div v-if="data.namespace.metadata" style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="名称" class="namespace-info">
          <span class="namespace-detail-info" style="margin-left: 90px">
            {{ data.namespace.metadata.name }}
          </span>
        </el-form-item>
        <el-form-item label="状态" class="namespace-info">
          <span class="namespace-detail-info" style="margin-left: 90px">
            <div v-if="data.namespace.status.phase === 'Active'" class="color-green-word">
              {{ data.namespace.status.phase }}
            </div>
            <div v-else class="color-red-word">{{ data.namespace.status.phase }}</div>
          </span>
        </el-form-item>
        <el-form-item label="描述" class="namespace-info">
          <span class="namespace-detail-info" style="margin-left: 90px"> - </span>
        </el-form-item>
        <el-form-item label="创建时间" class="namespace-info">
          <span class="namespace-detail-info" style="margin-left: 65px">
            {{ data.namespace.metadata.creationTimestamp }}
          </span>
        </el-form-item>
      </div>
    </el-card>
  </div>

  <div v-if="data.activeName === 'second'">
    <div style="margin-top: 20px">
      <el-col>
        <button class="pixiu-two-button" style="width: 85px" @click="editYaml">编辑YAML</button>
        <button class="pixiu-two-button" style="margin-left: 10px" @click="copyYmal">复制</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="GetPod"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 10px"></div>
    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
    </div>
  </div>
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

  pod: {},

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
  margin-top: 1px;
  margin-bottom: -32px;
}

.namespace-info {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.namespace-detail-info {
  font-size: 13px;
  color: #29232b;
}
</style>
