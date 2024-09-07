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
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
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
            <el-tabs v-model="data.activeTable" tab-position="left">
              <el-tab-pane label="基础信息">
                <Meta
                  ref="metaRef"
                  :replicas="data.deploymentForm.spec.replicas"
                  :metadata="data.deploymentForm.metadata"
                />
              </el-tab-pane>
              <el-tab-pane label="容器配置">
                <Containers />
              </el-tab-pane>
              <el-tab-pane label="高级选项">Role</el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="2">
            <el-button link type="primary" @click="onPreView">预览yaml</el-button>
          </el-col>
        </el-row>
        <div style="margin-top: 30px" />
        <el-form-item style="margin-left: 30%">
          <el-button
            class="pixiu-confirm-button"
            type="primary"
            :disabled="data.activeTable === '0'"
            @click="handlePre"
            >上一步</el-button
          >
          <el-button
            class="pixiu-confirm-button"
            type="primary"
            :disabled="data.activeTable === '2'"
            @click="handleNext"
            >下一步</el-button
          >
          <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
          <el-button
            v-show="data.activeTable === '2'"
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
    v-if="data.yamlVisible"
    v-model:visible="data.yamlVisible"
    title="预览"
    :yaml="data.deploymentForm"
    :read-only="true"
    @confirm="logInfo"
  />
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref, defineAsyncComponent } from 'vue';
import { createDeployment } from '@/services/kubernetes/deploymentService';
const Meta = defineAsyncComponent(() => import('@/components/kubernetes/meta.vue'));
const Containers = defineAsyncComponent(() => import('@/components/kubernetes/containers.vue'));
const Yaml = defineAsyncComponent(() => import('@/components/kubernetes/yaml.vue'));

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Deployment 名称', trigger: 'blur' }],
};

const metaRef = ref();
const data = reactive({
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
      template: {
        metadata: {
          labels: {},
        },
        spec: {
          containers: [
            {
              name: '',
              image: '',
              imagePullPolicy: 'IfNotPresent',
            },
          ],
        },
      },
    },
  },
});
const handleNext = async () => {
  if (!(await aggregateInfo())) {
    return;
  }
  let active = parseInt(data.activeTable, 10);
  if (active === 2) {
    return;
  }
  active = active + 1;
  data.activeTable = active + '';
};
const handlePre = () => {
  let active = parseInt(data.activeTable, 10);
  if (active >= 1) {
    active = active - 1;
  }
  data.activeTable = active + '';
};
const aggregateInfo = async () => {
  const [metadata, replicas, verified] = await metaRef.value.getResult();
  if (!verified) {
    proxy.$message.error('请正确填写');
    return false;
  }
  data.deploymentForm.metadata = metadata;
  data.deploymentForm.spec.replicas = replicas;
  data.deploymentForm.spec.selector.matchLabels = JSON.parse(JSON.stringify(metadata.labels));
  data.deploymentForm.spec.template.metadata.labels = JSON.parse(JSON.stringify(metadata.labels));
  return true;
};
const logInfo = (yaml) => {
  console.log(yaml);
};
const onPreView = async () => {
  if (await aggregateInfo()) {
    data.yamlVisible = true;
  }
};

const confirmCreate = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.deploymentForm.metadata = data.form.metadata;
      data.deploymentForm.spec.template.spec.containers = data.form.containers;

      data.deploymentForm.spec.selector.matchLabels['pixiu.io/app'] = data.form.metadata.name;
      data.deploymentForm.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
      data.deploymentForm.spec.template.metadata.labels =
        data.deploymentForm.spec.selector.matchLabels;

      // 追加 labels
      if (data.form.labels.length > 0) {
        data.deploymentForm.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.deploymentForm.metadata['labels'][item.key] = item.value;
        }
      }

      const [result, err] = await createDeployment(
        data.cluster,
        data.form.metadata.namespace,
        data.deploymentForm,
      );
      if (err) {
        proxy.$message.error(err.response.data.message);
        return;
      }

      proxy.$message.success(`Deployment ${data.form.metadata.name} 创建成功`);

      backToDeployment();
    }
  });
};

const cancelCreate = () => {
  backToDeployment();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.cluster = data.cloud.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  addContainer();
});

const addContainer = () => {
  data.form.containers.push({
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
  });
};

const deleteContainer = (index) => {
  if (data.form.containers.length === 1) {
    proxy.$message.error('至少需要 1 个容器组');
    return;
  }
  data.form.containers.splice(index, 1);
};

// 回到 deployment 页面
const backToDeployment = () => {
  proxy.$router.push({
    name: 'Deployment',
    query: data.cloud,
  });
};
</script>

<style>
.box-card {
  margin-top: 20px;
}

.deployee-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.deploy-pixiu-column {
  font-size: 13px;
  color: #606266;
}

.container-line-describe {
  margin-left: 90px;
  font-size: 12px;
  color: #888888;
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
