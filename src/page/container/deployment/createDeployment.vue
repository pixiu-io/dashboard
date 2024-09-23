<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 60px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToDeployment"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ state.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Deployments </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建Deployment </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <el-card class="create-card-style">
        <el-row :gutter="30">
          <el-col :span="22">
            <el-tabs v-model="state.activeTable" tab-position="left" :before-leave="onHandleChange">
              <el-tab-pane label="基础信息">
                <Meta
                  ref="metaRef"
                  :replicas="state.deploymentForm.spec.replicas"
                  :metadata="state.deploymentForm.metadata"
                />
              </el-tab-pane>
              <el-tab-pane label="容器配置">
                <Containers
                  ref="containersRef"
                  :containers="state.deploymentForm.spec.template.spec.containers"
                  :init-containers="state.deploymentForm.spec.template.spec.initContainers"
                  :volumes="state.deploymentForm.spec.template.spec.volumes"
                />
              </el-tab-pane>
              <el-tab-pane label="高级选项"
                ><Advance ref="advanceRef" :strategy="state.deploymentForm.spec.strategy"
              /></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="onPreView">预览yaml</el-button>
          </el-col>
        </el-row>
        <div style="margin-top: 30px" />
        <el-form-item style="margin-left: 30%">
          <el-button
            class="pixiu-confirm-button"
            type="primary"
            :disabled="state.activeTable === '0'"
            @click="handlePre"
            >上一步</el-button
          >
          <el-button
            v-show="state.activeTable !== '2'"
            class="pixiu-confirm-button"
            type="primary"
            @click="handleNext"
            >下一步</el-button
          >
          <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
          <el-button
            v-show="state.activeTable === '2'"
            class="pixiu-confirm-button"
            type="primary"
            @click="confirmCreate()"
            >确定</el-button
          >
        </el-form-item>
      </el-card>
    </el-main>
  </div>
  <Yaml
    v-if="state.yamlVisible"
    v-model:visible="state.yamlVisible"
    title="预览"
    :yaml="state.deploymentForm"
    :read-only="true"
  />
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref, defineAsyncComponent } from 'vue';
import { createDeployment } from '@/services/kubernetes/deploymentService';
const Meta = defineAsyncComponent(() => import('@/components/kubernetes/meta.vue'));
const Containers = defineAsyncComponent(() => import('@/components/kubernetes/containers.vue'));
const Yaml = defineAsyncComponent(() => import('@/components/kubernetes/yaml.vue'));
const Advance = defineAsyncComponent(() => import('@/components/kubernetes/advance.vue'));
const { proxy } = getCurrentInstance();

const metaRef = ref();
const containersRef = ref();
const advanceRef = ref();
const state = reactive({
  activeTable: '0',
  yamlVisible: false,
  loading: false,
  cluster: '',
  clusterName: '',

  namespaces: [],

  autosize: {
    minRows: 5,
  },

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    selector: [],
    containers: [],
  },

  // deployment 创建初始对象
  deploymentForm: {
    metadata: {
      name: '',
      namespace: 'default',
      labels: {},
      annotations: {},
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {},
      },
      strategy: {},
      template: {
        metadata: {
          labels: {},
        },
        spec: {
          serviceAccount: 'default',
          containers: [
            {
              name: '',
              image: '',
              imagePullPolicy: 'IfNotPresent',
              securityContext: {
                privileged: false,
              },
              stdin: false,
              tty: false,
              env: [],
              ports: [],
              resources: {},
              livenessProbe: {},
              startupProbe: {},
              readinessProbe: {},
              lifecycle: {
                postStart: {},
                preStop: {},
              },
              command: [],
              args: [],
              volumeMounts: [],
            },
          ],
          initContainers: [],
          volumes: [],
        },
      },
    },
  },
});
const change = ref(false);
const onHandleChange = async (activeName, oldActiveName) => {
  if (!change.value && activeName < oldActiveName) return;
  return await aggregateInfo(oldActiveName);
};
const handleNext = async () => {
  if (await aggregateInfo(state.activeTable, false)) {
    change.value = true;
    state.activeTable = Math.min(2, parseInt(state.activeTable, 10) + 1).toString();
    change.value = false;
  }
};
const handlePre = () => {
  state.activeTable = Math.max(0, parseInt(state.activeTable, 10) - 1).toString();
};

const aggregateInfo = async (activeName, checkAll = false) => {
  if (activeName === '0' || checkAll) {
    const [metadata, replicas, verified] = await metaRef.value.getResult();
    if (!verified) {
      proxy.$message.error('请正确填写必填项');
      return false;
    }
    metadata.labels['pixiu'] = metadata.name;
    state.deploymentForm.metadata = { ...metadata };
    state.deploymentForm.spec.replicas = replicas;
    state.deploymentForm.spec.selector.matchLabels = JSON.parse(JSON.stringify(metadata.labels));
    state.deploymentForm.spec.template.metadata.labels = JSON.parse(
      JSON.stringify(metadata.labels),
    );
  }
  if (activeName === '1' || checkAll) {
    const [containers, initContainers, volumes, containerVerified] =
      await containersRef.value.getContainers();
    if (!containerVerified) {
      proxy.$message.error('请正确填写必填项');
      return false;
    }
    state.deploymentForm.spec.template.spec.containers = JSON.parse(JSON.stringify(containers));
    state.deploymentForm.spec.template.spec.initContainers = JSON.parse(
      JSON.stringify(initContainers),
    );
    state.deploymentForm.spec.template.spec.volumes = volumes;
  }
  if (activeName === '2' || checkAll) {
    const [strategy, verified] = await advanceRef.value.getAdvanceInfo();
    if (!verified) {
      proxy.$message.error('请正确填写必填项');
      return false;
    }
    state.deploymentForm.spec.strategy = JSON.parse(JSON.stringify(strategy));
  }
  return true;
};
const onPreView = async () => {
  if (await aggregateInfo(state.activeTable)) {
    state.yamlVisible = true;
  }
};

const confirmCreate = async () => {
  if (!(await aggregateInfo(state.activeTable, true))) {
    return;
  }
  const [result, err] = await createDeployment(
    state.cluster,
    state.form.metadata.namespace,
    state.deploymentForm,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Deployment ${state.form.metadata.name} 创建成功`);
  backToDeployment();
};

const cancelCreate = () => {
  backToDeployment();
};

onMounted(() => {
  state.cloud = proxy.$route.query;
  state.cluster = state.cloud.cluster;
  state.clusterName = localStorage.getItem(state.cluster);
});

// 回到 deployment 页面
const backToDeployment = () => {
  proxy.$router.push({
    name: 'Deployment',
    query: state.cloud,
  });
};
</script>

<style>
.deployee-class .el-main {
  background-color: #f3f4f7;
}

.deployee-class .el-radio {
  background-color: white;
  border-radius: 0;
  margin-right: 0;
  width: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deployee-class .el-radio.is-bordered.is-checked {
  border-color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__input.is-checked + .el-radio__label {
  color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__label {
  font-size: 13px;
}

.deployee-class .el-radio__inner {
  display: none;
}
</style>
