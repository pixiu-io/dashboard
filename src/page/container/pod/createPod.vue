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

            <el-scrollbar height="480px" view-style="overflow-x: hidden" style="margin-top: 30px">
              <div v-if="data.active === 0">
                <el-form-item label="名称" prop="metadata.name" style="width: 500px">
                  <el-input v-model="data.form.metadata.name" />
                  <div class="app-pixiu-line-describe2">
                    最长63个字符，只能包含小写字母、数字及分隔符("-")
                  </div>
                </el-form-item>

                <el-form-item label="命名空间" style="width: 300px; margin-top: -4px">
                  <div class="namespace-select-container">
                    <el-select v-model="data.form.metadata.namespace" @change="changeNamespace">
                      <el-option
                        v-for="item in data.namespaces"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
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
              </div>
              <el-form-item label="容器配置" style="margin-top: 10px; margin-bottom: 10px">
                <el-button type="text" class="app-action-btn" @click="addContainer"
                  >增加容器</el-button
                >
              </el-form-item>
              <div style="margin-top: -15px"></div>
              <el-form-item
                v-for="(item, index) in data.form.containers"
                :key="index"
                style="margin-top: -25px"
              >
                <el-card
                  style="
                    width: 99%;
                    height: 185px;
                    background-color: #f2f2f2;
                    margin-top: 20px;
                    border-radius: 0px;
                  "
                >
                  <div style="float: right; cursor: pointer" @click="deleteContainer(index)">
                    <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                  </div>

                  <el-form-item
                    class="deploy-pixiu-column"
                    :prop="'containers[' + index + '].name'"
                    :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
                    >容器名称
                    <el-input
                      v-model="item.name"
                      class="deploy-pixiu-incard"
                      style="margin-left: 30px"
                    />
                  </el-form-item>

                  <el-form-item
                    style="margin-top: 10px"
                    class="deploy-pixiu-column"
                    :prop="'containers[' + index + '].image'"
                    :rules="[{ required: true, message: '镜像不能为空', trigger: 'blur' }]"
                    >镜像
                    <el-input
                      v-model="item.image"
                      style="margin-left: 58px"
                      class="deploy-pixiu-incard"
                    />
                  </el-form-item>

                  <el-col style="margin-top: 10px" class="deploy-pixiu-column"
                    >拉取策略
                    <el-radio-group v-model="item.imagePullPolicy" style="margin-left: 30px">
                      <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                      <el-radio-button label="Always">Always</el-radio-button>
                      <el-radio-button label="Never">Never</el-radio-button>
                    </el-radio-group>
                    <div class="container-line-describe">
                      设置镜像拉取策略，默认使用 IfNotPresent 策略
                    </div>
                  </el-col>
                </el-card>
              </el-form-item>
            </el-scrollbar>

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="confirm()"
                >确定</el-button
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
