<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 部署计划 </span>
    </el-card>
    <div style="margin-top: 20px"></div>

    <Description
      :description="'新建部署计划以自建 kubernetes 集群，完全兼容开源 Kubernetes 集群标准功能，并强化节点管理、集群网络、容器调度等能力。'"
    />

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            class="pixiu-button"
            style="margin-left: 1px"
            @click="goToCreatePlan"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            新建计划
          </el-button>
          <el-input
            v-model="data.pageInfo.search.searchInfo"
            placeholder="多个过滤标签用回车分隔"
            style="width: 560px; float: right"
            clearable
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="getPlanList"
              />
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="data.loading"
          :data="data.planList"
          stripe
          style="margin-top: 2px; width: 100%"
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="名称" sortable>
            <template #default="scope">
              <el-link
                class="global-table-world"
                type="primary"
                :underline="false"
                @click="updatePlan(scope.row)"
              >
                {{ scope.row.name }}
              </el-link>
              <el-tooltip content="复制">
                <pixiu-icon
                  name="icon-copy"
                  style="cursor: pointer; margin-left: 3px"
                  size="12px"
                  type="iconfont"
                  color="#909399"
                  @click="copy(scope.row.name)"
                />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="step" label="状态" :formatter="formatterPlanStatus" />

          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />

          <el-table-column prop="description" label="描述">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.description }}
              </div>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="180px">
            <template #default="scope">
              <el-button
                text
                size="small"
                style="margin-right: -24px; margin-left: -10px; color: #006eff"
                @click="startTask(scope.row)"
              >
                启动部署
              </el-button>
              <el-button
                text
                size="small"
                style="margin-right: -2px; color: #006eff"
                @click="handleTaskDrawer(scope.row)"
              >
                进度
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item
                      class="dropdown-item-buttons"
                      @click="handleDeleteDialog(scope.row)"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <div class="table-inline-word">暂无部署计划</div>
          </template>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <!-- 添加用户信息 -->
  <el-dialog
    v-model="data.createDialog.close"
    style="color: #000000; font: 14px"
    width="560px"
    draggable
    center
    @close="handleCreateCloseDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">新建计划</div>
    </template>
    <el-card class="app-docs" style="height: 40px; margin-top: -2px; margin-left: 6px">
      <div style="margin-top: -12px">
        <el-icon
          style="
            vertical-align: middle;
            font-size: 18px;
            margin-left: -20px;
            margin-right: 8px;
            margin-top: -25px;
          "
          ><WarningFilled
        /></el-icon>

        <div style="vertical-align: middle; margin-top: -27px; margin-left: 10px">
          新建部署计划以自建 kubernetes 集群.
        </div>
      </div>
    </el-card>

    <el-form
      ref="createFormRef"
      :label-position="labelPosition"
      :rules="createFormRules"
      label-width="80px"
      :model="data.createForm"
      style="max-width: 90%"
    >
      <el-form-item required prop="name">
        <template #label>
          <span style="font-size: 13px; color: #191919">计划名称</span>
        </template>
        <el-input v-model="data.createForm.name" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">描述</span>
        </template>
        <el-input v-model="data.createForm.description" type="textarea" :autosize="data.autosize" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="handleCreateCloseDialog"
          >取消</el-button
        >
        <el-button class="pixiu-small-confirm-button" type="primary" @click="confirmCreate"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    :alias-name="data.deleteDialog.aliasName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <el-drawer
    v-model="data.taskData.drawer"
    :size="data.taskData.width"
    :with-header="false"
    @open="openTaskDrawer"
    @close="closeTaskDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          部署计划
        </div>

        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">获取部署计划的部署情况</div>
        </el-card>

        <el-row>
          <el-col>
            <div style="margin-left: 8px">
              <button class="pixiu-two-button" @click="openTaskDrawer">刷新</button>
            </div>
          </el-col>
        </el-row>

        <div style="margin-top: 25px">
          <el-table
            :data="data.taskData.tableData"
            stripe
            style="margin-top: 6px"
            header-row-class-name="pixiu-table-header"
            :cell-style="{
              'font-size': '12px',
              color: '#191919',
            }"
          >
            <el-table-column prop="name" width="150px" label="名称" />

            <el-table-column
              prop="gmt_create"
              label="启动时间"
              sortable
              width="180px"
              :formatter="formatterTime"
            />

            <el-table-column
              prop="gmt_modified"
              label="结束时间"
              width="180px"
              sortable
              :formatter="formatterTime"
            />

            <el-table-column prop="status" label="状态" width="120px">
              <template #default="scope">
                <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                  <el-icon v-if="scope.row.status === '运行中'" class="is-loading" color="#409efc"
                    ><RefreshRight
                  /></el-icon>
                  <el-icon v-else-if="scope.row.status === '已成功'" color="#529b2e"
                    ><SuccessFilled
                  /></el-icon>
                  <el-icon v-else-if="scope.row.status === '部署失败'" color="#c45656"
                    ><CircleCloseFilled
                  /></el-icon>
                  <el-icon v-else color="#909399"><InfoFilled /></el-icon>
                  {{ scope.row.status }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <el-button
                  text
                  size="small"
                  style="margin-right: -24px; margin-left: -20px; color: #006eff"
                  :disabled="scope.row.status === '未开始'"
                  @click="handleTaskLogDrawer(scope.row)"
                >
                  日志
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="table-inline-word">暂无部署任务</div>
            </template>
          </el-table>
        </div>
      </div>
    </div>
    <el-drawer
      v-model="data.taskLog.drawer"
      :size="data.taskLog.width"
      :with-header="false"
      @open="openTaskLogDrawer"
      @close="closeTaskLogDrawer"
    >
      <div style="display: flex; height: 100%; width: 100%">
        <div style="width: 220px">
          <el-steps direction="vertical" process-status="success" align-center class="steps">
            <el-step
              v-for="(activity, index) in data.taskData.tableData"
              :key="index"
              :title="activity.name"
              :description="formatTimestamp(activity.gmt_create)"
              :status="stepStatus(activity.status)"
            />
          </el-steps>
        </div>
        <div style="width: 100%">
          <PixiuLog
            :yaml-dialog="data.taskLog.drawer"
            :log="data.taskLog.log"
            :scroll-end="true"
          ></PixiuLog>
        </div>
      </div>
    </el-drawer>
  </el-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime, formatterPlanStatus } from '@/utils/formatter';
import { formatTimestamp, readStream } from '@/utils/utils';
import Pagination from '@/components/pagination/index.vue';
import {
  createPlan,
  GetPlanList,
  deletePlan,
  startPlanTask,
  watchPlanTasks,
  watchPlanTaskLog,
} from '@/services/plan/planService';
import Description from '@/components/description/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { copy } from '@/utils/utils';
import PixiuLog from '@/components/pixiulog/index.vue';
import { MoreFilled } from '@element-plus/icons-vue';
import { extractDateFormat } from 'element-plus';

const router = useRouter();
const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  streams: [], // 处理流
  LogStreams: [], // 处理流
  tableData: [],
  planList: [],

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  updateForm: {},
  autosize: {
    minRows: 5,
  },

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '部署计划',
    deleteName: '',
    aliasName: '',
  },

  // 创建属性
  createDialog: {
    close: false,
  },
  createForm: {
    name: '',
    status: 0,
    description: '',
  },

  // 部署任务
  taskData: {
    drawer: false,
    width: '40%',
    task: '',
    tableData: [],
  },
  taskLog: {
    drawer: false,
    width: '55%',
    task: '',
    log: '',
  },
});

onMounted(() => {
  getPlanList();
});

// 分页
const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  getPlanList();
};

// 开始 创建用户
const handleCreateDialog = () => {
  data.createDialog.close = true;
};

const handleCreateCloseDialog = () => {
  data.createDialog.close = false;

  setTimeout(() => {
    data.createForm = {
      name: '',
      status: 0,
      description: '',
    };
  }, 100);
};

const confirmCreate = async () => {
  const [result, err] = await createPlan(data.createForm);
  if (err) {
    proxy.$notify.error({ message: err });
    return;
  }
  proxy.$notify.success({ message: `部署计划(${data.createForm.name})创建成功` });
  await getPlanList();
  handleCreateCloseDialog();
};
// 结束创建

// 删除 开始
const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.id;
  data.deleteDialog.aliasName = row.name;
};

const confirm = async () => {
  const [result, err] = await deletePlan(data.deleteDialog.deleteName);
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  proxy.$notify.success(`部署计划(${data.deleteDialog.aliasName}) 删除成功`);

  await getPlanList();
  cancel();
};

const updatePlan = (row) => {
  proxy.$router.push({
    name: 'PlanUpdate',
    query: {
      planId: row.id,
    },
  });
};

const cancel = () => {
  data.deleteDialog.close = false;
  // 延迟 1 秒重置数据，否则页面上会显的很怪
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};
// 删除 结束

// startTask
const startTask = async (row) => {
  const [result, err] = await startPlanTask(row.id);
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  proxy.$notify.success(`部署计划(${row.name}) 启动成功`);
};
// 结束startTask

const goToCreatePlan = () => {
  proxy.$router.push({
    name: 'PlanCreate',
  });
};

const stepStatus = (status) => {
  switch (status) {
    case '已成功':
      return 'success';
    case '未开始':
      return 'wait';
    case '运行中':
      return 'process';
    case '部署失败':
      return 'error';
  }
};

const handleTaskLogDrawer = (row) => {
  data.taskLog.task = row;
  data.taskLog.drawer = true;
};
const openTaskLogDrawer = async () => {
  if (data.LogStreams.length !== 0) {
    for (let s of data.LogStreams) {
      s.abort();
    }
    data.LogStreams = [];
  }

  let controller = new AbortController();
  let single = controller.signal;
  data.LogStreams.push(controller);

  const { body, err } = await watchPlanTaskLog(
    data.taskLog.task.plan_id,
    data.taskLog.task.id,
    single,
  );
  if (err) {
    proxy.$message.error('Failed to get task list', err);
    return;
  }
  if (body) {
    const reader = body.getReader();
    await readStream(reader, (decodedString) => {
      data.taskLog.log += decodedString;
    });
  }
};
// 开始处理任务进度
const handleTaskDrawer = (row) => {
  data.taskData.task = row;
  data.taskData.drawer = true;
};

const openTaskDrawer = async () => {
  if (data.streams.length !== 0) {
    for (const s of data.streams) {
      s.abort();
    }
    data.streams = [];
  }

  let controller = new AbortController();
  let single = controller.signal;
  data.streams.push(controller);

  const { body, err } = await watchPlanTasks(data.taskData.task.id, single);
  if (err) {
    proxy.$message.error('Failed to get task list', err);
    return;
  }
  if (body) {
    const reader = body.getReader();
    await readStream(reader, (decodedString) => {
      try {
        const result = JSON.parse(decodedString);
        data.taskData.tableData = result;
      } catch (e) {
        proxy.$message.error('Error parsing JSON:', e);
      }
    });
  }
};

// const readStream = async (reader) => {
//   const decoder = new TextDecoder('utf-8');
//   while (true) {
//     try {
//       const { value, done } = await reader.read();
//       if (done) {
//         reader.cancel();
//         break;
//       }
//       const uint8Array = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
//       let decodedString = decoder.decode(uint8Array, { stream: true });
//       // 解析JSON数据
//     } catch (e) {
//       break;
//     }
//   }
// };

// const readLogStream = async (reader) => {
//   const decoder = new TextDecoder('utf-8');
//   while (true) {
//     try {
//       const { value, done } = await reader.read();
//       if (done) {
//         reader.cancel();
//         break;
//       }
//       const uint8Array = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
//       let decodedString = decoder.decode(uint8Array, { stream: true });
//       state.taskLog.log += decodedString;
//     } catch (e) {
//       break;
//     }
//   }
// };

const closeTaskDrawer = () => {
  data.taskData.drawer = false;

  // 关闭stream
  if (data.streams.length !== 0) {
    for (const s of data.streams) {
      s.abort();
    }
    data.streams = [];
  }
  setTimeout(() => {
    data.taskData = {
      tableData: [],
      width: '40%',
      task: '',
    };
  }, 100);
};

const closeTaskLogDrawer = () => {
  data.taskLog.drawer = false;
  data.taskLog.log = '';

  // 关闭stream
  if (data.LogStreams.length !== 0) {
    for (const s of data.LogStreams) {
      s.abort();
    }
    data.LogStreams = [];
  }
};

// 结束处理任务进度

const getPlanList = async () => {
  data.loading = true;
  const [result, err] = await GetPlanList();
  data.loading = false;
  if (err) {
    proxy.$message.error(err);
    return;
  }

  data.planList = result;
  if (result !== null) {
    data.pageInfo.total = result.length;
  }
};

const jumpRoute = (row) => {
  router.push({
    name: 'PlanDetail',
    query: {
      name: row.name,
      planId: row.id,
    },
  });
};
</script>
<style lang="less" scoped>
@publicColor: #049a3a;
@publicHeight: 18px;
@publicProcess: rgb(51.2, 126.4, 204);
.steps {
  width: 80%;
  margin: 20px auto 0;
  height: @publicHeight;
  ::v-deep .el-step {
    margin-bottom: 70px;
    height: 100%;
    display: flex;
    //flex-direction: column; // 将步骤组件设置为垂直排列

    .el-step__line {
      background-color: rgba(0, 0, 0, 0.15);
      width: 1px; // 将宽度设置为1px，使其成为垂直线
      height: 50px; // 自动高度，根据内容调整
      margin-top: 30px !important; // 顶部外边距
      margin-bottom: 30px !important; // 底部外边距
      position: absolute; // 绝对定位
      transform: translateX(-50%); // 使线居中对齐
    }

    .el-step__icon {
      width: @publicHeight;
      height: @publicHeight;
      font-size: 16px;
      border: 1px solid;
      .el-step__icon-inner {
        font-weight: unset !important;
      }
    }
    .el-step__head.is-process {
      color: @publicProcess;
      border-color: @publicProcess;
    }
    .el-step__head.is-success {
      color: @publicColor;
      border-color: @publicColor;
    }
    .is-process .el-step__icon.is-text {
      background: @publicProcess;
      color: #fff;
    }
    .el-step__title.is-process {
      color: @publicProcess;
    }
    .el-step__title.is-success {
      color: #01712f;
    }
    .el-step__title {
      font-size: 16px;
    }

    .el-step__description.is-success {
      color: #01712f;
    }
  }
}
</style>
