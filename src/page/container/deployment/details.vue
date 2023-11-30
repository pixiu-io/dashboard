<template>
  <el-card class="glabal-detail-card">
    <div class="font-container">deployment</div>

    <el-tabs
      v-model="data.activeName"
      class="deployment-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first">Config</el-tab-pane>

      <el-tab-pane label="Pod管理" name="second"
        ><el-card class="box-card">
          <el-table :data="data.deploymentPods" stripe style="width: 100%">
            <el-table-column type="selection" width="30" />
            <el-table-column prop="metadata.name" label="实例名称" width="230px" />
            <el-table-column prop="metadata.creationTimestamp" label="创建时间" width="240px" />
            <el-table-column prop="status.phase" label="状态" width="180" />
            <el-table-column prop="status.hostIP" label="所在节点" />
            <el-table-column prop="status.podIP" label="实例IP" />
            <el-table-column prop="spec.priority" label="重启次数" />
            <el-table-column fixed="right" label="操作" width="150">
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  style="margin-right: -25px; margin-left: -10px; color: #006eff"
                  @click="editDeployment(scope.row)"
                >
                  销毁重建
                </el-button>

                <el-button
                  type="text"
                  size="small"
                  style="margin-right: 1px; color: #006eff"
                  @click="handleDeploymentScaleDialog(scope.row)"
                >
                  远程登陆
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card></el-tab-pane
      >
      <el-tab-pane label="事件" name="third">Role</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PixiuTag from '@/components/pixiuTag/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  restarts: 0,

  deployment: {},
  deploymentPods: [],
  deploymentEvents: [],

  activeName: 'first',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;
  data.namespace = proxy.$route.query.namespace;

  await getDeployment();
  await getDeploymentPods();
  await getDeploymentEvents();
});

const getDeployment = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${data.name}`,
  });
  data.deployment = res;

  console.log(data.deployment);
};

const getDeploymentPods = async () => {
  let matchLabels = data.deployment.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }

  const pods = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods`,
    data: {
      labelSelector: labels.join(','),
      limit: 500,
    },
  });
  data.deploymentPods = pods.items;
};

const getDeploymentEvents = async () => {
  let labels = [];
  labels.push('involvedObject.name=' + data.deployment.metadata.name);
  labels.push('involvedObject.namespace=' + data.deployment.metadata.namespace);
  labels.push('involvedObject.kind=' + data.deployment.kind);
  labels.push('involvedObject.uid=' + data.deployment.metadata.uid);

  const events = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/events`,
    data: {
      labelSelector: labels.join(','),
      limit: 500,
    },
  });
  data.deploymentEvents = events.items;

  console.log('data.deploymentEvents', data.deploymentEvents);
};

const handleClick = (tab, event) => {};

const handleChange = (name) => {};
</script>

<style scoped="scoped">
.deployment-tab {
  margin-top: 30px;
}

.demo-tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
