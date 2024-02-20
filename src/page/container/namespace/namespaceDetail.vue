<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToNamespace"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Namespace: {{ data.name }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Namespace详情 </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <el-tabs
        v-model="data.activeName"
        class="detail-card-style"
        @tab-click="handleClick"
        @tab-change="handleChange"
      >
        <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
        <el-tab-pane label="YAML" name="second"></el-tab-pane>
      </el-tabs>

      <div v-if="data.activeName === 'first'">
        <el-card class="contend-card-container2" style="width: 70%; margin-left: 30px">
          <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>
          <div
            v-if="data.namespace.metadata"
            style="margin-top: 8px; width: 100%; border-radius: 0px"
          >
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
        <div style="margin-top: 20px; margin-left: 30px">
          <el-col>
            <button class="pixiu-two-button" style="width: 85px" @click="editYaml">编辑YAML</button>
            <button class="pixiu-two-button" style="margin-left: 10px" @click="copyYmal">
              复制
            </button>

            <div style="margin-left: 8px; float: right; margin-top: 6px">
              <pixiu-icon
                name="icon-icon-refresh"
                style="cursor: pointer"
                size="14px"
                type="iconfont"
                color="#909399"
                @click="getDeployment"
              />
            </div>
          </el-col>
        </div>
        <div style="margin-top: 15px"></div>
        <div style="margin-left: 30px">
          <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly"></MyCodeMirror>
          <div v-if="!data.readOnly" style="margin-top: 10px">
            <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
            <el-button class="pixiu-confirm-button" type="primary" @click="confirm()"
              >确定</el-button
            >
          </div>
        </div>
      </div>
    </el-main>
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
  clusterName: '',

  name: '',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  namespace: '',

  activeName: 'first',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

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
      <div class="pixiu-ellipsis-style">{time}</div>
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
.detail-card-style {
  margin-top: -10px;
  margin-bottom: -18px;
  margin-left: 30px;
  width: 70%;
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
