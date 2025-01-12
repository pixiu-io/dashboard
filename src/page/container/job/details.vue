<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToDeployment"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>

        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Deployment:{{ data.name }}({{ data.namespace }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 20px"></div>

    <el-tabs
      v-model="data.activeName"
      class="deployment-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="Pod管理" name="second"> </el-tab-pane>
      <el-tab-pane label="日志" name="third"> </el-tab-pane>
      <el-tab-pane label="事件" name="four"></el-tab-pane>
      <el-tab-pane label="YAML" name="five"></el-tab-pane>
    </el-tabs>
  </el-card>

  <div v-if="data.activeName === 'first'">
    <el-card class="contend-card-container2">
      <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>

      <div v-if="data.deployment.metadata" style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="名称" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 90px">
            {{ data.deployment.metadata.name }}
          </span>
        </el-form-item>
        <el-form-item label="命名空间" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 63px">
            {{ data.deployment.metadata.namespace }}
          </span>
        </el-form-item>
        <el-form-item label="创建时间" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 63px">
            {{ data.deployment.metadata.creationTimestamp }}
          </span>
        </el-form-item>
        <el-form-item label="Labels" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 75px">
            <div v-if="data.deployment.spec.selector.matchLabels === undefined">-</div>
            <div v-else>
              <div
                v-for="(item, index) in data.deployment.spec.selector.matchLabels"
                :key="item"
                style="margin-top: -1px"
              >
                {{ index }}: {{ item }}
              </div>
            </div>
          </span>
        </el-form-item>
        <el-form-item label="更新策略" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 63px">
            {{ data.deployment.spec.strategy.type }}
          </span>
        </el-form-item>
        <el-form-item label="副本数" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 75px">
            {{ data.deployment.spec.replicas }}
          </span>
        </el-form-item>
        <el-form-item label="其他" class="deployment-info">
          <span class="deploy-detail-info" style="margin-left: 88px"> - </span>
        </el-form-item>
      </div></el-card
    >
  </div>

  <div v-if="data.activeName === 'second'">
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <button class="pixiu-two-button">刷新</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">销毁重建</button>

          <div style="margin-left: 8px; float: right; margin-top: 6px">
            <pixiu-icon
              name="icon-icon-refresh"
              style="cursor: pointer"
              size="14px"
              type="iconfont"
              color="#909399"
              @click="getDeploymentPods"
            />
          </div>

          <el-input
            v-model="data.pageInfo.query"
            placeholder="名称搜索关键字"
            style="width: 480px; float: right"
            clearable
            @clear="getDeploymentPods"
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="getDeploymentPods"
              />
            </template>
          </el-input>
          <div style="float: right">
            <el-switch v-model="data.crontab" inline-prompt width="36px" /><span
              style="font-size: 13px; margin-left: 5px; margin-right: 10px"
              >自动刷新</span
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <el-card style="margin-top: 15px" class="contend-card-container2">
      <el-table
        v-loading="data.loading"
        :data="data.deploymentPods"
        stripe
        style="margin-top: 10px; width: 100%; margin-bottom: 25px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" label="实例名称" min-width="70px">
          <template #default="scope">
            {{ scope.row.metadata.name }}
            <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copy(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterStatus" />
        <el-table-column prop="status.hostIP" label="所在节点" />

        <el-table-column prop="status.podIP" label="实例IP">
          <template #default="scope">
            {{ scope.row.status.podIP }}
            <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copyIP(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="status.containerStatuses"
          label="重启次数"
          :formatter="getPodRestartCount"
        />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="160px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="deletePod(scope.row)"
            >
              销毁重建
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="openShell(scope.row)"
            >
              远程连接
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <div v-if="data.activeName === 'third'">
    <el-card class="contend-card-container2">
      <div class="big-world-style">筛选条件</div>

      <el-form-item
        label="Pod选项"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 92px">
          <el-select
            v-model="data.selectedPod"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changePod"
          >
            <el-option v-for="item in data.selectedPods" :key="item" :value="item" :label="item" />
          </el-select>
        </span>

        <span class="deploy-detail-info" style="margin-left: 8px">
          <el-select
            v-model="data.selectedContainer"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changeContainer"
          >
            <el-option
              v-for="item in data.selectedContainers"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </span>

        <div style="margin-left: 4px; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="16px"
            type="iconfont"
            color="#909399"
            @click="getDeploymentPods"
          />
        </div>
      </el-form-item>

      <el-form-item
        label="其他选项"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 90px">
          <el-select
            v-model="data.logLine"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changeLogLine"
          >
            <el-option v-for="item in data.logLines" :key="item" :value="item" :label="item" />
          </el-select>
        </span>
      </el-form-item>

      <div style="margin-left: 170px; margin-top: -10px; margin-bottom: 10px">
        <el-switch v-model="data.previous" inline-prompt width="36px" /><span
          style="font-size: 14px; margin-left: 5px; margin-right: 10px"
          >查看已退出的容器</span
        >
      </div>
    </el-card>

    <button style="margin-top: 15px" class="pixiu-two-button" @click="getPodLog">刷新</button>

    <div style="float: right; margin-top: 8px">
      <el-switch v-model="data.logAutoRefresh" inline-prompt width="36px" /><span
        style="font-size: 13px; margin-left: 5px; margin-right: 10px"
        >自动刷新</span
      >
      <pixiu-icon
        name="icon-icon-refresh"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#909399"
        @click="getPodLog"
      />
    </div>

    <div style="margin-top: 15px">
      <el-card class="contend-card-container2">
        <div style="background-color: #29232b; color: white; min-height: 440px">
          <div style="margin-left: 20px">
            <div v-if="data.podLogs.length === 0" style="font-size: 14px">暂无日志</div>
            <div v-else>
              <div v-for="(item, index) in data.podLogs" :key="item" style="font-size: 14px">
                {{ index + 1 }} <span style="margin-left: 18px"></span> {{ item }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'four'">
    <el-card class="contend-card-container2">
      <div class="big-world-style">筛选条件</div>

      <el-form-item
        label="命令空间"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 90px">
          <el-select
            v-model="data.namespace"
            style="width: 230px; float: right; margin-right: 10px"
          >
          </el-select>
        </span>
      </el-form-item>

      <el-form-item label="类型" class="deployment-info" style="font-size: 15px; margin-left: 8px">
        <span class="deploy-detail-info" style="margin-left: 120px">
          <el-select
            v-model="data.workloadType"
            style="width: 230px; float: right; margin-right: 10px"
          >
          </el-select>
        </span>
      </el-form-item>
      <el-form-item label="名称" class="deployment-info" style="font-size: 15px; margin-left: 8px">
        <span class="deploy-detail-info" style="margin-left: 120px">
          <el-select v-model="data.name" style="width: 230px; float: right; margin-right: 10px">
          </el-select>
        </span>
      </el-form-item>
    </el-card>

    <el-col>
      <button style="margin-top: 15px" class="pixiu-two-button" @click="getDeploymentEvents">
        刷新
      </button>
      <button style="margin-top: 15px; margin-left: 10px; width: 85px" class="pixiu-two-button2">
        批量删除
      </button>

      <div style="float: right; margin-top: 16px">
        <el-switch v-model="data.eventAutoRefresh" inline-prompt width="36px" /><span
          style="font-size: 13px; margin-left: 5px; margin-right: 10px"
          >自动刷新</span
        >
        <pixiu-icon
          name="icon-icon-refresh"
          style="cursor: pointer"
          size="16px"
          type="iconfont"
          color="#909399"
          @click="getDeploymentEvents"
        />
      </div>
    </el-col>

    <div style="margin-top: 18px">
      <el-card class="contend-card-container2">
        <el-table
          v-loading="data.loading"
          :data="data.deploymentEvents"
          stripe
          style="margin-top: 10px; width: 100%; margin-bottom: 25px"
          header-row-class-name="pixiu-table-header"
          :cell-style="{
            'font-size': '12px',
            color: '#191919',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30px" />
          <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
          <el-table-column prop="type" label="级别" />
          <el-table-column prop="kind" label="资源类型"> </el-table-column>
          <el-table-column prop="objectName" label="资源名称"> </el-table-column>
          <el-table-column prop="message" label="内容" width="500ox" />

          <el-table-column fixed="right" label="操作" width="100px">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="margin-right: -25px; margin-left: -10px; color: #006eff"
                @click="deleteEvent(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'five'">
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
            @click="getDeployment"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 10px"></div>
    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly" :height="650"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
    </div>
  </div>

  <el-dialog v-model="showDialog" width="300" title="选择要链接的容器">
    <div
      style="display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <el-button
        v-for="(item, index) in selectedContainers"
        :key="index"
        type="primary"
        link
        @click="
          selectedContainer = item.name;
          openWindowShell();
          showDialog = false;
          selectedContainer = '';
          selectedContainers = [];
          selectedPod = '';
        "
      >
        {{ item.name }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import MyCodeMirror from '@/components/codemirror/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getTableData, copy, formatTimestamp } from '@/utils/utils';
import { formatterTime, formatterPodStatus, formatterRestartCount } from '@/utils/formatter';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getStatefulSet } from '@/services/kubernetes/statefulsetService';
import {
  getPodsByLabels,
  getPodContainerLog,
  deletePod,
  getPodLog,
} from '@/services/kubernetes/podService';
import { getStatefulSetEventList } from '@/services/kubernetes/eventService';

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
    status: {},
  },

  createTime: '',

  podData: {
    loading: false,
    pods: [],
    tableData: [],
    pageInfo: {
      page: 1,
      limit: 10,
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

  logData: {
    loading: false,
    selectedPodMap: {},
    selectedPods: [],
    selectedPod: '',
    selectedContainers: [],
    selectedContainer: '',

    previous: false,
    line: 10,
    lineOptions: [10, 25, 50, 100],

    podLogs: [],
    tableData: [],

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

  GetJob();
});

const GetJob = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: `/pixiu/proxy/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${data.name}`,
  });
  data.deployment = res;
};

const handleClick = (tab, event) => {};

const handleChange = (name) => {};

const goToJob = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/jobs', query: queryParams });
};
</script>

<style scoped="scoped"></style>
