<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToStatefulSet">返回</button>
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
      <el-tab-pane label="容器组" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"></el-tab-pane>
      <el-tab-pane label="日志查询" name="four"> </el-tab-pane>
      <el-tab-pane label="监控" name="five"> </el-tab-pane>
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
            <span class="detail-card-value-style" style="margin-left: 55px"> 运行中</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">运行时 </span>
              <span class="detail-card-value-style" style="margin-left: 40px"> 普通运行时 </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">更新策略 </span>
              <span class="detail-card-value-style"> 未知 </span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">实例个数 </span>
            <span class="detail-card-value-style"> 1/1 </span>
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
        <div style="vertical-align: middle; margin-top: -40px">管理运行在 ds 上的全部 pod 实例</div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="GetObjectPods"
            >
              查询
            </button>

            <el-input
              v-model="data.podData.pageInfo.nameSelector"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="GetObjectPods"
              @input="GetObjectPods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="GetObjectPods"
                />
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.podData.loading"
        :data="data.podData.tableData"
        stripe
        style="margin-top: 10px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称" min-width="120px">
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

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column prop="metadata.namespace" label="命名空间"> </el-table-column>

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

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
      <pagination :total="data.podData.pageInfo.total" @on-change="onChange"></pagination>
    </div>
  </el-card>

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
            @click="getStatefulSetPods"
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
      <button style="margin-top: 15px" class="pixiu-two-button" @click="getStatefulSetEvents">
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
          @click="getStatefulSetEvents"
        />
      </div>
    </el-col>

    <div style="margin-top: 18px">
      <el-card class="contend-card-container2">
        <el-table
          v-loading="data.loading"
          :data="data.statefulsetEvents"
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
            @click="getStatefulSet"
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

  GetStatefulSet();
});

const changePod = async (val) => {
  data.selectedPod = val;
  data.selectedContainers = data.selectedPodMap[data.selectedPod];

  if (data.selectedContainers.length > 0) {
    data.selectedContainer = data.selectedContainers[0];
  }
};

const GetStatefulSet = async () => {
  const [result, err] = await getStatefulSet(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
};

// 处理 pod 开始
const GetObjectPods = async () => {
  let matchLabels = data.object.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }

  data.podData.loading = true;
  const [result, err] = await getPodsByLabels(data.cluster, data.namespace, labels.join(','));
  data.podData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.podData.pods = result.items;
  data.podData.pageInfo.total = data.podData.pods.length;
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
};

// 处理 pod 结束

const handleClick = (tab, event) => {};

const handleChange = (name) => {
  if (name === 'second') {
    GetObjectPods();
  } else {
    data.podData.pods = [];
    data.podData.pageInfo.total = 0;
    data.podData.tableData = [];
  }
};

const goToStatefulSet = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/statefulsets', query: queryParams });
};
</script>

<style scoped="scoped"></style>
