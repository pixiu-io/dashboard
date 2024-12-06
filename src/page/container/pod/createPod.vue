<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 60px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToPod"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Pods </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建Pod </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card class="create-card-style" style="width: 75%">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.form"
            class="create-card-form"
          >
            <el-steps
              style="max-width: 90%; margin-left: 6px; margin-top: 15px"
              :active="data.active"
              finish-status="success"
            >
              <el-step>
                <template #title>
                  <span style="margin-left: 2px; font-size: 14px; color: #191919">基本信息 </span>
                </template>
              </el-step>
              <el-step>
                <template #title>
                  <span style="margin-left: 2px; font-size: 14px; color: #191919">容器组设置 </span>
                </template>
              </el-step>

              <el-step>
                <template #title>
                  <span style="margin-left: 2px; font-size: 14px; color: #191919">高级选项 </span>
                </template>
              </el-step>
            </el-steps>

            <el-scrollbar height="450px" view-style="overflow-x: hidden" style="margin-top: 30px">
              <div v-if="data.active === 0">
                <el-form-item label="名称" prop="metadata.name">
                  <template #label>
                    <span class="form-item-key-style">名称 </span>
                  </template>

                  <el-input v-model="data.frontObject.name" style="width: 50%" />
                </el-form-item>
                <el-form-item>
                  <div class="dialog-describe-style" style="margin-left: 0px">
                    只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63
                    个字符。
                  </div>
                </el-form-item>

                <el-form-item label="命名空间">
                  <template #label>
                    <span class="form-item-key-style">命名空间 </span>
                  </template>

                  <div class="namespace-select-container">
                    <el-select
                      v-model="data.frontObject.namespace"
                      style="width: 210px"
                      @change="changeNamespace"
                    >
                      <el-option
                        v-for="item in data.namespaces"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select>
                  </div>
                </el-form-item>

                <el-form-item label="Labels">
                  <template #label>
                    <span class="form-item-key-style">Labels</span>
                  </template>

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

                  <div
                    style="float: right; cursor: pointer; margin-left: 10px"
                    @click="deleteLabel(index)"
                  >
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
                <el-form-item>
                  <template #label>
                    <span class="form-item-key-style">描述</span>
                  </template>
                  <el-input
                    v-model="data.frontObject.description"
                    style="margin-top: 8px; width: 60%"
                    type="textarea"
                    :autosize="data.frontObject.autosize"
                  />
                </el-form-item>
              </div>

              <div v-if="data.active === 1">ddd</div>
            </el-scrollbar>

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
              <el-button
                v-if="data.active > 0"
                type="primary"
                class="pixiu-delete-cancel-button"
                @click="lastStep"
                >上一步</el-button
              >
              <el-button
                v-if="data.active < 2"
                type="primary"
                class="pixiu-delete-confirm-button"
                @click="nextStep"
                >下一步</el-button
              >
              <el-button
                v-if="data.active === 2"
                type="primary"
                class="pixiu-delete-confirm-button"
                @click="confirmCreate"
                >确认</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createPod } from '@/services/kubernetes/podService';

const ruleFormRef = ref();

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  active: 0,

  cluster: '',
  clusterName: '',
  namespace: 'default',

  namespaces: [],

  frontObject: {
    name: '',
    namespace: '',
    kind: 'pod',
    description: '',
    autosize: {
      minRows: 5,
    },

    close: false,
    // 容器配置
    containers: [],

    // 选择节点配置
    choiceNode: false,
    nodeSelectLabels: [],
    // 添加元数据
    enableMetadata: false,
    labels: [],
    annotations: [],
    // 容器配置
    containers: [],
    imagePullPolicies: ['IfNotPresent', 'Always', 'Never'],
    restartPolicies: ['Always'],
    restartPolicy: 'Always',
    hostNetwork: false,

    // 存储设置
    storageTypeChoices: ['持久卷', '临时卷', 'HostPath卷', '配置字典', '保密字典'],
  },

  endObject: {
    metadata: {},
    spec: {
      template: {
        metadata: {},
        spec: {},
      },
    },
  },

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    containers: [],
  },
  // 创建或者更新 form
  objectForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      containers: [],
    },
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Pod 名称', trigger: 'blur' }],
};

const nextStep = () => {
  if (data.active++ >= 4) data.active = 4;
};

const lastStep = () => {
  if (data.active-- <= 0) data.active = 0;
};

onMounted(() => {
  data.query = proxy.$route.query;

  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  getNamespaces();
  addContainer();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

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
      data.objectForm.metadata = data.form.metadata;
      data.objectForm.spec.containers = data.form.containers;

      // 追加 labels
      if (data.form.labels.length > 0) {
        data.objectForm.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.objectForm.metadata['labels'][item.key] = item.value;
        }
      }

      const [result, err] = await createPod(data.cluster, data.namespace, data.objectForm);
      if (err) {
        proxy.$message.error(err.response.data.message);
        return;
      }
      proxy.$message.success(`Pod ${data.form.metadata.name} 创建成功`);

      backToPod();
    }
  });
};

const cancel = () => {
  backToPod();
};

// 添加容器相关函数开始

const openContainerAdvanceOption = (item) => {
  item.advance = !item.advance;
};

const addNodeSelectLabel = () => {
  data.frontObject.nodeSelectLabels.push({ key: '', value: '' });
};

const deleteNodeSelectLabel = (index) => {
  data.frontObject.nodeSelectLabels.splice(index, 1);
};

const metaChange = () => {
  if (data.frontObject.enableMetadata) {
    if (data.frontObject.labels.length === 0) {
      addLabel();
    }
  }
};

const addAnnotation = () => {
  data.frontObject.annotations.push({ key: '', value: '' });
};

const deleteAnnotation = (index) => {
  data.frontObject.annotations.splice(index, 1);
};

const nodeChange = () => {
  if (data.frontObject.choiceNode) {
    if (data.frontObject.nodeSelectLabels.length === 0) {
      addNodeSelectLabel();
    }
  }
};

const envChange = (item) => {
  if (item.choiceEnv) {
    if (item.envs.length === 0) {
      addEnv(item);
    }
  }
};

const addEnv = (item) => {
  item.envs.push({
    type: '自定义',
    key: '',
    value: '',
  });
};

const deleteEnv = (item, index) => {
  item.envs.splice(index, 1);
};

const portChange = (item) => {
  if (item.choicePort) {
    if (item.ports.length === 0) {
      addPort(item);
    }
  }
};

const addPort = (item) => {
  item.ports.push({
    name: '',
    protocol: 'TCP',
    containerPort: '',
  });
};

const deletePort = (item, index) => {
  item.ports.splice(index, 1);
};

const addStorage = (item) => {
  item.storages.push({
    volumeType: 'HostPath卷',
    name: '',
    mountSrc: '',
    mountPath: '',
  });
};

const deleteStorage = (item, index) => {
  item.storages.splice(index, 1);
};

// 添加容器相关函数结束

const cancelCreate = () => {
  backToStatefulSet();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.cluster = data.cloud.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  addContainer();
  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.frontObject.namespace = val;
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const addLabel = () => {
  data.frontObject.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.frontObject.labels.splice(index, 1);
};

const addContainer = () => {
  data.frontObject.containers.push({
    name: '',
    containerType: '工作容器',
    containerTypes: ['工作容器', '初始化容器'],
    image: '',
    imagePullPolicy: 'IfNotPresent',
    advance: false,
    cpuRequst: '',
    cpuLimit: '',
    memoryRequst: '',
    memoryLimit: '',
    choicePort: false,
    ports: [],
    portProtocols: ['TCP', 'UDP', 'SCTP'],
    choiceEnv: false,
    envs: [],
    choiceCmd: false,
    cmds: {
      cmd: '',
      args: '',
    },
    choiceHealth: false,
    healthCheckTypes: ['HTTP 请求', '命令', 'TCP 端口'],
    schemes: ['HTTP', 'HTTPS'],
    healths: {
      liveness: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },
        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
      readiness: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },

        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
      startup: {
        enable: false,
        checkType: 1,
        cmd: '',
        port: '',
        httpGet: {
          path: '/',
          port: '80',
          scheme: 'HTTP',
        },

        initialDelaySeconds: 0,
        timeoutSeconds: 1,
        periodSeconds: 10,
        successThreshold: 1,
        failureThreshold: 3,
      },
    },
    // 容器存储
    choiceStorage: false,
    storages: [],
    mountSrcs: [],
  });
};

const deleteContainer = (index) => {
  data.frontObject.containers.splice(index, 1);
};

const backToPod = () => {
  proxy.$router.push({
    name: 'Pod',
    query: data.query,
  });
};
</script>

<style></style>
