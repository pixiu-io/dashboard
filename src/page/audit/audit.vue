<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 部署计划 </span>
    </el-card>

    <Description
      :description="'新建部署计划以自建 kubernetes 集群，完全兼容开源 Kubernetes 集群标准功能，并强化节点管理、集群网络、容器调度等能力。'"
      :icon-style="{
        fontSize: '18px',
        verticalAlign: 'middle',
        marginLeft: '-20px',
        marginRight: '8px',
        marginTop: '-20px',
      }"
      :text-style="{
        verticalAlign: 'middle',
        marginTop: '-27px',
        marginLeft: '10px',
      }"
      :card-style="{
        marginTop: '',
        marginLeft: '',
      }"
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
              <el-link class="global-table-world" type="primary" :underline="false">
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

          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />

          <el-table-column prop="step" label="状态" :formatter="formatterPlanStatus" />

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
                @click="updatePlan(scope.row)"
              >
                更新
              </el-button>
              <el-button
                text
                size="small"
                style="margin-right: -2px; color: #006eff"
                @click="handleTaskDrawer(scope.row)"
              >
                查看进度
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item class="dropdown-item-buttons" @click="startTask(scope.row)">
                      启动部署
                    </el-dropdown-item>

                    <el-dropdown-item
                      class="dropdown-item-buttons"
                      @click="handleDeleteDialog(scope.row)"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>

                  <el-dropdown-menu class="dropdown-buttons"> </el-dropdown-menu>
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
            <el-table-column prop="name" label="名称" sortable />

            <el-table-column
              prop="gmt_create"
              label="启动时间"
              sortable
              :formatter="formatterTime"
            />

            <el-table-column
              prop="gmt_modified"
              label="结束时间"
              sortable
              :formatter="formatterTime"
            />

            <el-table-column prop="status" label="状态">
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

            <template #empty>
              <div class="table-inline-word">暂无部署任务</div>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime, formatterPlanStatus } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import {
  createPlan,
  GetPlanList,
  deletePlan,
  startPlanTask,
  watchPlanTasks,
} from '@/services/plan/planService';
import Description from '@/components/description/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { copy } from '@/utils/utils';

const router = useRouter();

const data = reactive({
  loading: false,
  streams: [], // 处理流
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
</script>

<style></style>
