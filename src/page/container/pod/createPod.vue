<template>
  <el-card class="title-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToPod"
      />
      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span style="color: black"> Cluster: {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span style="color: black"> Namespace: {{ data.namespace }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> Pods </span> </el-breadcrumb-item>
        <el-breadcrumb-item><span style="color: black"> 创建Pod </span> </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <el-card class="create-card-style">
    <el-form
      ref="ruleFormRef"
      label-position="left"
      require-asterisk-position="right"
      label-width="100px"
      :rules="rules"
      status-icon
      :model="data.form"
      style="margin-left: 3%; width: 70%"
    >
      <div style="margin-top: 20px" />
      <el-form-item label="名称" prop="metadata.name" style="width: 500px">
        <el-input v-model="data.form.metadata.name" />
        <div class="app-pixiu-line-describe2">
          最长63个字符，只能包含小写字母、数字及分隔符("-")
        </div>
      </el-form-item>

      <el-form-item label="命名空间" style="width: 300px; margin-top: -4px">
        <div class="namespace-select-container">
          <el-select v-model="data.form.metadata.namespace" @change="changeNamespace">
            <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="Labels" style="margin-top: 10px">
        <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
      </el-form-item>
      <div style="margin-top: -15px"></div>
      <el-form-item
        v-for="(item, index) in data.form.labels"
        :key="index"
        class="labels-item-style"
      >
        <el-form-item
          :prop="'labels[' + index + '].key'"
          :rules="[{ required: true, message: '标签键不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
        </el-form-item>

        <div style="margin-right: 10px; margin-left: 10px">=</div>

        <el-form-item
          :prop="'labels[' + index + '].value'"
          :rules="[{ required: true, message: '标签值不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
        </el-form-item>

        <div style="float: right; cursor: pointer; margin-left: 10px" @click="deleteLabel(index)">
          <pixiu-icon
            name="icon-shanchu"
            size="14px"
            type="iconfont"
            style="margin-top: 10px; margin-left: 4px"
            color="#909399"
          />
        </div>
      </el-form-item>
      <div class="app-pixiu-line-describe" style="margin-top: -5px">
        标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
      </div>

      <el-form-item label="容器配置" style="margin-top: 10px">
        <el-button type="text" class="app-action-btn" @click="addContainer">增加容器</el-button>
      </el-form-item>
      <div style="margin-top: -15px"></div>
      <el-form-item
        v-for="(item, index) in data.form.containers"
        :key="index"
        style="margin-top: -25px"
      >
        <el-card
          style="
            width: 90%;
            height: 185px;
            background-color: #f2f2f2;
            margin-top: 20px;
            border-radius: 0px;
          "
        >
          <div style="float: right; cursor: pointer" @click="deleteContainer(index)">
            <el-icon><Delete /></el-icon>
          </div>
          <el-col class="deploy-pixiu-column"
            >容器名称
            <el-input v-model="item.name" class="deploy-pixiu-incard" style="margin-left: 30px" />
          </el-col>

          <el-col style="margin-top: 10px" class="deploy-pixiu-column"
            >镜像
            <el-input v-model="item.image" style="margin-left: 56px" class="deploy-pixiu-incard" />
          </el-col>

          <el-col style="margin-top: 10px" class="deploy-pixiu-column"
            >拉取策略
            <el-radio-group v-model="item.imagePullPolicy" style="margin-left: 30px">
              <el-radio label="IfNotPresent" border>IfNotPresent</el-radio>
              <el-radio label="Always" border>Always</el-radio>
              <el-radio label="Never" border>Never</el-radio>
            </el-radio-group>
            <div class="container-line-describe">设置镜像拉取策略，默认使用 IfNotPresent 策略</div>
          </el-col>
        </el-card>
      </el-form-item>

      <div style="margin-top: 30px" />
      <el-form-item style="margin-left: 30%">
        <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
        <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';

const ruleFormRef = ref();

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  cluster: '',
  clusterName: '',
  namespace: 'default',

  namespaces: [],

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {},
    labels: [],
    containers: [],
  },
  // 创建或者更新 form
  objectForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {},
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Pod 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  getNamespaces();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const confirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
    }
  });
};

const cancel = () => {
  backToPod();
};

const addLabel = () => {
  data.form.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.form.labels.splice(index, 1);
};

const addContainer = () => {
  data.form.containers.push({
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
  });
};

const deleteContainer = (index) => {
  data.form.containers.splice(index, 1);
};

const backToPod = () => {
  proxy.$router.push({
    name: 'Pod',
    query: data.query,
  });
};
</script>

<style></style>
