<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Service</div>
  </el-card>

  <el-main>
    <el-card class="create-card-style">
      <el-form label-position="left" label-width="100px" style="margin-left: 3%; width: 80%">
        <div style="margin-top: 20px" />
        <el-form-item label="名称" style="width: 500px">
          <el-input v-model="data.form.metadata.name" />
          <div class="app-pixiu-line-describe2">
            最长63个字符，只能包含小写字母、数字及分隔符("-")
          </div>
        </el-form-item>

        <div style="margin-top: -10px" />
        <el-form-item label="命名空间" style="width: 380px">
          <div class="namespace-select-container">
            <el-select v-model="data.form.metadata.namespace" @change="changeNamespace">
              <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
            </el-select>
          </div>

          <div style="margin-left: 10px; margin-top: 6px">
            <pixiu-icon
              name="icon-icon-refresh"
              style="cursor: pointer"
              size="16px"
              type="iconfont"
              color="#909399"
              @click="getNamespaceList"
            />
          </div>
        </el-form-item>

        <div style="margin-top: 20px" />
        <el-form-item label="类型" style="width: 600px">
          <el-radio-group v-model="data.form.spec.type" style="margin-top: 4px">
            <el-radio-button label="ClusterIP" border>ClusterIP</el-radio-button>
            <el-radio-button label="NodePort" border>NodePort</el-radio-button>
            <el-radio-button label="LoadBalancer" border>LoadBalancer</el-radio-button>
          </el-radio-group>
          <div class="app-pixiu-line-describe2">
            <div v-if="data.form.spec.type === 'ClusterIP'">
              通过集群的内部 IP 公开 Service，选择该值时 Service 只能够在集群内部访问。
            </div>
            <div v-else-if="data.form.spec.type === 'NodePort'">
              通过每个节点上的 IP 和静态端口公开 Service
            </div>
            <div v-else>使用云平台的负载均衡器向外部公开 Service。</div>
          </div>
        </el-form-item>

        <div style="margin-top: -6px" />
        <el-form-item label="使用方式" style="width: 600px">
          <el-radio-group v-model="data.serviceType" style="margin-top: 4px">
            <el-radio-button label="常规服务" border>常规服务</el-radio-button>
            <el-radio-button label="Headless" border>Headless</el-radio-button>
          </el-radio-group>
          <div class="app-pixiu-line-describe2">
            <div v-if="data.serviceType === 'Headless'">
              不需要负载均衡，也不需要单独的 Service IP。
            </div>
          </div>
        </el-form-item>

        <div style="margin-top: -10px" />
        <el-form-item label="标签" style="margin-top: 10px">
          <el-button type="text" class="app-action-btn" style="color: #3377ff" @click="addLabel"
            >新增</el-button
          >
        </el-form-item>
        <el-form-item v-for="(item, index) in data.labels" :key="index" style="margin-top: -15px">
          <div>
            <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
          </div>
          <div style="margin-right: 10px; margin-left: 10px">=</div>
          <div>
            <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
          </div>
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
        <div class="app-pixiu-line-describe" style="margin-top: -10px">
          标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
        </div>

        <div style="margin-top: 10px" />
        <el-form-item label="Selector" style="width: 600px">
          <el-radio-group v-model="data.selectorType" style="margin-top: 4px">
            <el-radio-button label="普通" border>普通</el-radio-button>
            <el-radio-button label="高级" border>高级</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <div v-if="data.selectorType === '高级'">
          <el-form-item style="margin-top: -15px">
            <el-button
              type="text"
              class="app-action-btn"
              style="color: #3377ff"
              @click="addSelector"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item
            v-for="(item, index) in data.selectors"
            :key="index"
            style="margin-top: -15px"
          >
            <div>
              <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
            </div>
            <div style="margin-right: 10px; margin-left: 10px">=</div>
            <div>
              <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
            </div>
            <div
              style="float: right; cursor: pointer; margin-left: 10px"
              @click="deleteSelector(index)"
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
          <div class="app-pixiu-line-describe" style="margin-top: -10px">
            Selector 以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
          </div>
        </div>
      </el-form>
    </el-card>
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  cluser: '',
  namespaces: [],

  labels: [],
  selectors: [],

  serviceType: '常规服务',
  selectorType: '高级',
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      type: 'ClusterIP',
    },
  },
});

const handleChange = (value) => {
  data.deploymentForm.spec.replicas = value;
};

const comfirm = async () => {
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/app'] = data.deploymentForm.metadata.name;
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
  data.deploymentForm.spec.template.metadata.labels = data.deploymentForm.spec.selector.matchLabels;

  for (let i = 0; i < data.deploymentLabels.length; i++) {
    data.deploymentForm.spec.template.metadata.labels[data.deploymentLabels[i].key] =
      data.deploymentLabels[i].value;
  }

  try {
    const resp = await proxy.$http({
      method: 'post',
      url:
        `/proxy/pixiu/${data.cloud.cluster}/apis/apps/v1/namespaces/` +
        data.deploymentForm.metadata.namespace +
        `/deployments`,
      data: data.deploymentForm,
    });
  } catch (error) {}

  proxy.$message.success(`deployment ${data.deploymentForm.metadata.name} 创建成功`);
  backToService();
};

const cancel = () => {
  backToService();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaceList();

  data.labels.push({
    key: '',
    value: '',
  });
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.deploymentForm.metadata.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cloud.cluster + '/api/v1/namespaces',
    });

    data.namespaces = [];
    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
};

const addLabel = () => {
  data.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.labels.splice(index, 1);
};

const addSelector = () => {
  data.selectors.push({
    key: '',
    value: '',
  });
};

const deleteSelector = (index) => {
  data.selectors.splice(index, 1);
};

const backToService = () => {
  proxy.$router.push({
    name: 'Service',
    query: data.cloud,
  });
};
</script>

<style></style>
