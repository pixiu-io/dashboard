<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToSecret"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Namespace: {{ data.name }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Secret详情 </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 28px"></div>

    <el-tabs
      v-model="data.activeName"
      class="detail-card-new-style"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="YAML" name="second"></el-tab-pane>
    </el-tabs>
  </el-card>

  <div v-if="data.activeName === 'first'">
    <el-card class="contend-card-container2" style="width: 70%">
      <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>
      <div v-if="data.namespace.metadata" style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="名称" class="secret-info">
          <span class="secret-detail-info" style="margin-left: 90px">
            {{ data.secret.metadata.name }}
          </span>
        </el-form-item>
        <el-form-item label="状态" class="secret-info">
          <span class="secret-detail-info" style="margin-left: 90px">
            <div v-if="data.namespace.status.phase === 'Active'" class="color-green-word">
              {{ data.namespace.status.phase }}
            </div>
            <div v-else class="color-red-word">{{ data.namespace.status.phase }}</div>
          </span>
        </el-form-item>
        <el-form-item label="描述" class="secret-info">
          <span class="secret-detail-info" style="margin-left: 90px"> - </span>
        </el-form-item>
        <el-form-item label="创建时间" class="secret-info">
          <span class="secret-detail-info" style="margin-left: 65px">
            {{ data.time }}
          </span>
        </el-form-item>
        <el-form-item label="Labels" class="secret-info">
          <span class="secret-detail-info" style="margin-left: 65px"> - </span>
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
            @click="getSecretByName"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 15px"></div>
    <div>
      <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly"></MyCodeMirror>
      <div v-if="!data.readOnly" style="margin-top: 10px">
        <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
        <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { formatTimestamp } from '@/utils/utils';
import { ElMessage } from 'element-plus';
import { updateSecret, getSecret } from '@/services/kubernetes/secretService';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  clusterName: '',
  namespace: '',
  secret: '',
  name: '',

  time: '',
  activeName: 'first',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.yamlName = proxy.$route.query.name;
  data.clusterName = localStorage.getItem(data.cluster);

  data.name = proxy.$route.query.name;

  await getSecretByName();
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

const getSecretByName = async () => {
  const [result, err] = await getSecret(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.time = formatTimestamp(result.metadata.creationTimestamp);
  data.yaml = jsYaml.dump(result);
};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const goToSecret = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/secrets', query: queryParams });
};

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.secret-info {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.secret-detail-info {
  font-size: 13px;
  color: #29232b;
}
</style>
