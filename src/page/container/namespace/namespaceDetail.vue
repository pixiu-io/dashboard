<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToNamespace">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-zongrongqizu" size="75px" type="iconfont" color="#006eff" />
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 80px;
        "
      >
        <div
          class="breadcrumb-create-style"
          style="font-size: 17px; margin-top: -10px; margin-left: 10px"
        >
          {{ data.name }}
        </div>

        <div style="margin-bottom: 10px">
          <span class="detail-card-key-style" style="font-size: 12.5px">创建时间 </span>
          <span class="detail-card-value-style" style="margin-left: 5px; font-size: 12.5px">
            {{ data.createTime }}</span
          >
        </div>

        <div style="margin-bottom: -10px; margin-left: 10px">
          <button class="pixiu-two-button" @click="GetDaemonset">刷新</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
          </button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="handleQuotaDialog"
          >
            管理配额
          </button>
        </div>
      </div>
    </el-space>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
              >基本信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">实例名称 </span>
            <span class="detail-card-value-style"> {{ data.object.metadata.name }}</span>
          </el-col>

          <el-col :span="8">
            <span class="detail-card-key-style">状态 </span>
            <span class="detail-card-value-style" style="margin-left: 55px"> 运行中</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">创建时间 </span>
              <span class="detail-card-value-style"> {{ data.createTime }}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 25px">
          <el-col :span="10">
            <el-form-item>
              <template #label>
                <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                  >标签
                </span>
              </template>
            </el-form-item>

            <el-form-item style="margin-top: -10px">
              <div v-if="data.object.metadata.labels === undefined" style="margin-left: 10px">
                -
              </div>
              <div v-else style="margin-top: -8px">
                <div
                  v-for="(item, index) in data.object.metadata.labels"
                  :key="item"
                  style="font-size: 14px"
                >
                  <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                    >{{ index }}: {{ item }}</el-tag
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item>
              <template #label>
                <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                  >注释
                </span>
              </template>
            </el-form-item>

            <el-form-item style="margin-top: -10px">
              <div v-if="data.object.metadata.annotations === undefined" style="margin-left: 10px">
                -
              </div>
              <div v-else style="margin-top: -8px">
                <div
                  v-for="(item, index) in data.object.metadata.annotations"
                  :key="item"
                  style="font-size: 14px"
                >
                  <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                    >{{ index }}: {{ item }}</el-tag
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          命名空间关联事件查询，更多查询请至事件中心
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button class="pixiu-two-button" @click="GetEvents">查询</button>
            <button
              style="margin-left: 10px; width: 85px"
              class="pixiu-two-button2"
              @click="handleDeleteEventsDialog"
            >
              批量删除
            </button>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.eventData.loading"
        :data="data.eventData.eventTableData"
        stripe
        style="margin-top: 10px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleEventSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="involvedObject.kind" label="资源类型"> </el-table-column>
        <el-table-column prop="count" label="出现次数"> </el-table-column>
        <el-table-column prop="message" label="内容" min-width="260px" />
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.eventData.pageInfo.total" @on-change="onEventChange"></pagination>
    </div>
  </el-card>

  <el-dialog
    :model-value="data.quotaData.close"
    style="color: #191919; font: 14px"
    width="42%"
    align-center
    center
    @close="cleanQuota"
  >
    <template #header>
      <div class="header-docs">配额管理</div>
    </template>

    <el-card class="app-docs" style="margin-top: -0px; height: 40px; margin-left: 5px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        配额可以限制命名空间下的资源使用，支持以命名空间为粒度的资源划分。
      </div>
    </el-card>
    <div style="margin-top: -10px" />

    <el-table
      :data="data.quotaData.data"
      stripe
      style="margin-top: 2px; margin-left: 8px"
      header-row-class-name="pixiu-table-header"
      :cell-style="{
        'font-size': '12px',
        color: '#191919',
      }"
    >
      <el-table-column prop="name" label="应用资源">
        <template #default="scope"> {{ scope.row.name }} </template>
      </el-table-column>
      <el-table-column prop="value" label="配额">
        <template #default="scope">
          <el-input-number v-model="scope.row.value" size="small" :min="0" style="width: 115px" />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelQuota">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmQuota"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="GetNamespace"
  ></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp, getTableData } from '@/utils/utils';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { getNamespaceEventList } from '@/services/kubernetes/eventService';
import Pagination from '@/components/pagination/index.vue';
import {
  getNamespace,
  deleteNamespace,
  getQuotaList,
  patchQuota,
  deleteQuota,
  createQuota,
} from '@/services/kubernetes/namespaceService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',

  object: {
    metadata: {},
    spec: {},
    status: {},
  },
  createTime: '',
  activeName: 'first',

  eventData: {
    loading: false,
    events: [],
    eventTableData: [],
    multipleEventSelection: [],

    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

  quotaData: {
    close: false,
    exists: false,
    needDelete: true,
    name: '',
    namespaceName: '',
    oldSpec: {},
    data: [
      {
        name: 'CPU(核)',
        value: null,
      },
      {
        name: '内存(GiB)',
        value: null,
      },
      {
        name: '无状态负载 Deployment',
        value: null,
      },
      {
        name: '有状态负载 StatefulSet',
        value: null,
      },
      {
        name: '普通任务 Job',
        value: null,
      },
      {
        name: '定时任务 CronJob',
        value: null,
      },
      {
        name: '容器组 Pod',
        value: null,
      },
    ],
  },
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;

  GetNamespace();
});

const GetNamespace = async () => {
  const [result, err] = await getNamespace(data.cluster, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
};

// 事件处理开始
const GetEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getNamespaceEventList(data.cluster, data.name);
  data.eventData.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }
  data.eventData.events = result;
  data.eventData.pageInfo.total = result.length;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.eventData.events);
};

const onEventChange = (v) => {
  data.eventData.pageInfo.limit = v.limit;
  data.eventData.pageInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.eventData.events);
};

const handleEventSelectionChange = (events) => {
  data.eventData.multipleEventSelection = [];
  for (let event of events) {
    data.eventData.multipleEventSelection.push(event.metadata);
  }
};
const handleDeleteEventsDialog = (row) => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  data.deleteEventDialog.close = true;
  data.deleteEventDialog.deleteName = 'events';
  data.deleteEventDialog.namespace = '';
};

const confirmEvent = async () => {
  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }

  cancelEvent();
  proxy.$notify.success('批量删除事件成功');
  GetEvents();
};

const cancelEvent = () => {
  data.deleteEventDialog.close = false;
  setTimeout(() => {
    data.deleteEventDialog.deleteName = '';
  }, 100);
};
// 事件处理结束

// 编辑 yaml 开始
const viewYaml = async () => {
  const [obj, err] = await getNamespace(data.cluster, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yaml = obj;
  data.yamlDialog = true;
};
// 编辑 yaml 结束

// 管理配额开始
const handleQuotaDialog = async (row) => {
  const [quotas, err] = await getQuotaList(data.cluster, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  if (quotas.items.length !== 0) {
    data.quotaData.exists = true;
    const quota = quotas.items[0];
    data.quotaData.name = quota.name;
    data.quotaData.oldSpec = quota.spec;
    initQuotaData(quota);
  }

  data.quotaData.namespaceName = data.name;
  data.quotaData.close = true;
};

const cancelQuota = () => {
  data.quotaData.close = false;
  setTimeout(() => {
    cleanQuota();
  }, 100);
};

const initQuotaData = (quota) => {
  const hard = quota.spec.hard;
  for (let d of data.quotaData.data) {
    if (d.name === 'CPU(核)') {
      if (hard['limits.cpu']) {
        d.value = hard['limits.cpu'];
      }
    }
    if (d.name === '内存(GiB)') {
      if (hard['limits.memory']) {
        if (hard['limits.memory'].includes('Gi')) {
          d.value = hard['limits.memory'].split('Gi')[0];
        } else {
          d.value = hard['limits.memory'];
        }
      }
    }
    if (d.name === '无状态负载 Deployment') {
      if (hard['count/deployments.apps']) {
        d.value = hard['count/deployments.apps'];
      }
    }
    if (d.name === '有状态负载 StatefulSet') {
      if (hard['count/statefulsets.apps']) {
        d.value = hard['count/statefulsets.apps'];
      }
    }
    if (d.name === '普通任务 Job') {
      if (hard['count/jobs.batch']) {
        d.value = hard['count/jobs.batch'];
      }
    }
    if (d.name === '定时任务 CronJob') {
      if (hard['count/cronjobs.batch']) {
        d.value = hard['count/cronjobs.batch'];
      }
    }
    if (d.name === '容器组 Pod') {
      if (hard['count/pods']) {
        d.value = hard['count/pods'];
      }
    }
  }
};

const getQuotaNameForNamespace = (ns) => {
  return 'pixiu-' + ns + '-quota';
};

const initQuotaForm = (quotaData) => {
  data.quotaForm.metadata.name = getQuotaNameForNamespace(quotaData.namespaceName);
  data.quotaForm.metadata.namespace = quotaData.namespaceName;

  // 默认设置成true，根据直接情况修改
  data.quotaData.needDelete = true;
  let newHard = {};

  for (let d of quotaData.data) {
    if (d.name === 'CPU(核)') {
      if (d.value !== null && d.value !== 0) {
        newHard['limits.cpu'] = d.value;
        data.quotaData.needDelete = false;
      }
    }
    if (d.name === '内存(GiB)') {
      if (d.value !== null && d.value !== 0) {
        newHard['limits.memory'] = d.value + 'Gi';
        data.quotaData.needDelete = false;
      }
    }
    if (d.name === '无状态负载 Deployment') {
      if (d.value !== null && d.value !== 0) {
        newHard['count/deployments.apps'] = d.value;
        data.quotaData.needDelete = false;
      }
    }

    if (d.name === '有状态负载 StatefulSet') {
      if (d.value !== null && d.value !== 0) {
        newHard['count/statefulsets.apps'] = d.value;
        data.quotaData.needDelete = false;
      }
    }
    if (d.name === '普通任务 Job') {
      if (d.value !== null && d.value !== 0) {
        newHard['count/jobs.batch'] = d.value;
        data.quotaData.needDelete = false;
      }
    }
    if (d.name === '定时任务 CronJob') {
      if (d.value !== null && d.value !== 0) {
        newHard['count/cronjobs.batch'] = d.value;
        data.quotaData.needDelete = false;
      }
    }
    if (d.name === '容器组 Pod') {
      if (d.value !== null && d.value !== 0) {
        newHard['count/pods'] = d.value;
        data.quotaData.needDelete = false;
      }
    }
  }
  data.quotaForm.spec.hard = newHard;
};

const cleanQuota = () => {
  data.quotaData = {
    close: false,
    exists: false,
    needDelete: true,
    oldSpec: {},
    namespaceName: '',
    data: [
      {
        name: 'CPU(核)',
        value: null,
      },
      {
        name: '内存(GiB)',
        value: null,
      },
      {
        name: '无状态负载 Deployment',
        value: null,
      },
      {
        name: '有状态负载 StatefulSet',
        value: null,
      },
      {
        name: '普通任务 Job',
        value: null,
      },
      {
        name: '定时任务 CronJob',
        value: null,
      },
      {
        name: '容器组 Pod',
        value: null,
      },
    ],
  };
  data.quotaForm = {
    metadata: {
      name: '',
      namespace: '',
    },
    spec: {
      hard: {},
    },
  };
};

const confirmQuota = async () => {
  initQuotaForm(data.quotaData);

  // 更新
  if (data.quotaData.exists) {
    if (data.quotaData.needDelete) {
      // 删除
      const [result, err] = await deleteQuota(
        data.cluster,
        data.quotaForm.metadata.namespace,
        data.quotaForm.metadata.name,
      );
      if (err) {
        proxy.$notify.error(err.response.data.message);
        return;
      }
    } else {
      // 更新
      for (let key in data.quotaData.oldSpec.hard) {
        if (!data.quotaForm.spec.hard[key]) {
          data.quotaForm.spec.hard[key] = null;
        }
      }

      // 更新最新属性，移除老的值
      const patchData = {
        spec: {
          hard: data.quotaForm.spec.hard,
        },
      };
      const [result, err] = await patchQuota(
        data.cluster,
        data.quotaForm.metadata.namespace,
        data.quotaForm.metadata.name,
        patchData,
      );
      if (err) {
        proxy.$notify.error(err.response.data.message);
        return;
      }
    }
  } else {
    if (data.quotaData.needDelete) {
      cleanQuota();
      return;
    } else {
      const [result, err] = await createQuota(
        data.cluster,
        data.quotaForm.metadata.namespace,
        data.quotaForm,
      );
      if (err) {
        proxy.$notify.error(err.response.data.message);
        return;
      }
    }
  }

  proxy.$notify.success(`命名空间配额设置成功`);
  cleanQuota();
};
// 管理配额结束

const handleClick = (tab, event) => {};
const handleChange = (name) => {
  if (name === 'third') {
    GetEvents();
  } else {
    data.eventData.events = [];
    data.eventData.pageInfo.total = 0;
    data.eventData.eventTableData = [];
  }
};

const goToNamespace = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/namespaces', query: queryParams });
};
</script>

<style scoped="scoped"></style>
