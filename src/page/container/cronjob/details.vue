<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToCronJob">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-dingshirenwu1" size="75px" type="iconfont" color="#006eff" />
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
          <button class="pixiu-two-button" @click="GetCronJob">刷新</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
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
      <el-tab-pane label="任务列表" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">负载名称 </span>
            <span class="detail-card-value-style"> {{ data.object.metadata.name }}</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">命名空间 </span>
              <span class="detail-card-value-style">
                {{ data.object.metadata.namespace }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">创建时间 </span>
              <span class="detail-card-value-style"> {{ data.createTime }}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">状态 </span>
            <span class="detail-card-value-style" style="margin-left: 55px">
              {{ data.jobStatus }}</span
            >
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">定时计划 </span>
              <span class="detail-card-value-style">
                {{ data.object.spec.schedule }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">并发策略 </span>
              <span class="detail-card-value-style">
                {{ data.object.spec.concurrencyPolicy }}
              </span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">正在运行任务数 </span>
            <span class="detail-card-value-style">
              {{ data.jobNubmer }}
            </span>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">保留执行成功任务数 </span>
            <span class="detail-card-value-style">
              {{ data.object.spec.successfulJobsHistoryLimit }}
            </span>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">保留执行失败任务数 </span>
            <span class="detail-card-value-style">
              {{ data.object.spec.failedJobsHistoryLimit }}
            </span>
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

    <div v-if="data.activeName === 'second'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理运行在 CronJob 上的全部 Job 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="GetJobs"
            >
              查询
            </button>

            <el-input
              v-model="data.jobData.pageInfo.nameSelector"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="GetJobs"
              @input="GetJobs"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="GetJobs"
                />
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.jobData.loading"
        :data="data.jobData.tableData"
        style="margin-top: 10px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column prop="metadata.name" sortable label="任务名称" min-width="120px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterJobStatus" />

        <el-table-column prop="metadata.namespace" label="执行情况(完成/全部)"> </el-table-column>

        <el-table-column prop="status" label="运行时长" :formatter="formatterJobDuration">
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="60px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.jobData.pageInfo.total" @on-change="onChange"></pagination>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          CronJob 关联事件查询，更多查询请至事件中心
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

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="GetCronJob"
  ></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import MyCodeMirror from '@/components/codemirror/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getTableData, copy, formatTimestamp } from '@/utils/utils';
import {
  formatterTime,
  formatterCronJobStatus,
  formatterJobStatus,
  formatterJobDuration,
} from '@/utils/formatter';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getCronJob } from '@/services/kubernetes/cronjobService';
import { getJobList } from '@/services/kubernetes/jobService';
import { getCronJobEventList } from '@/services/kubernetes/eventService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  activeName: 'first',

  object: {
    metadata: {},
    spec: {},
    status: { active: [] },
  },

  createTime: '',
  jobStatus: '',
  jobNubmer: 0,

  jobData: {
    loading: false,
    jobs: [],
    tableData: [],
    pageInfo: {
      page: 1,
      limit: 500,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

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

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
    namespace: '',
  },
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetCronJob();
});

const GetCronJob = async () => {
  const [result, err] = await getCronJob(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
  let status = '已启动';
  if (data.object.spec.suspend) {
    status = '已暂停';
  }
  data.jobStatus = status;
  data.jobNubmer = data.object.status.active.length;
};

// 处理任务列表开始
const GetJobs = async () => {
  data.jobData.loading = true;
  const [result, err] = await getJobList(data.cluster, data.namespace, data.jobData.pageInfo);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.jobData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.jobData.tableData = [];
  for (let job of result.items) {
    if (job.metadata.ownerReferences !== undefined) {
      if (job.metadata.ownerReferences.length > 0) {
        if (
          job.metadata.ownerReferences[0].name === data.name &&
          job.metadata.ownerReferences[0].uid === data.object.metadata.uid
        ) {
          data.jobData.tableData.push(job);
        }
      }
    }
  }
  data.jobData.pageInfo.total = data.jobData.tableData.length;
};
// 处理任务列表结束

// 编辑 yaml 开始
const viewYaml = async () => {
  const [obj, err] = await getCronJob(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yaml = obj;
  data.yamlDialog = true;
};
// 编辑 yaml 结束

const handleClick = (tab, event) => {};

const handleChange = (name) => {
  if (name === 'third') {
    GetEvents();
  } else {
    data.eventData.events = [];
    data.eventData.pageInfo.total = 0;
    data.eventData.eventTableData = [];
  }

  if (name === 'second') {
    GetJobs();
  } else {
    data.jobData.pageInfo.total = 0;
    data.jobData.tableData = [];
  }
};

const goToCronJob = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/cronJob', query: queryParams });
};

// 事件处理开始
const GetEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getCronJobEventList(
    data.cluster,
    data.object.metadata.uid,
    data.namespace,
    data.name,
  );
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
</script>

<style scoped="scoped"></style>
