<template>
  <el-card class="title-card-container">
    <div class="font-container">节点管理</div>
    <PiXiuYaml :refresh="getNodes"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createStorageClass">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getNodes">刷新</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="getNodes"
          />
        </div>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNodes"
          @input="searchNodes"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getNodes"
            />

            <!-- <el-icon class="el-input__icon" @click="getNodes">
              <component :is="'Search'" />
            </el-icon> -->
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.tableData"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        header-row-class-name="pixiu-table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="节点名称">
          <template #default="scope">
            <div style="display: flex">
              <div>
                <el-link
                  class="global-table-world"
                  :underline="false"
                  type="primary"
                  @click="jumpRoute(scope.row)"
                >
                  {{ scope.row.metadata.name }}
                </el-link>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" :formatter="runningFormatter">
        </el-table-column>

        <!--
        <el-table-column label="角色" prop="metadata" :formatter="formatNodeRole">
        </el-table-column> -->

        <!-- <el-table-column label="节点配置" prop="status" :formatter="formatIp"> </el-table-column> -->
        <el-table-column label="IP地址" prop="status" :formatter="formatNodeIp"> </el-table-column>

        <el-table-column label="节点版本" prop="status.nodeInfo.kubeletVersion"> </el-table-column>
        <el-table-column
          label="运行时"
          prop="status.nodeInfo.containerRuntimeVersion"
          :formatter="formatString"
        >
        </el-table-column>

        <el-table-column label="不可调度">
          <template #default="scope">
            <el-switch
              v-model="scope.row.spec.unschedulable"
              inline-prompt
              size="small"
              @change="changeScheduleStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -26px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              监控
            </el-button>

            <el-button type="text" size="small" style="color: #006eff"> 事件 </el-button>
            <el-dropdown>
              <span class="cluster-dropdown">
                更多
                <div style="margin-left: 2px"></div>
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleEditLabelDialog(scope.row)"
                  >
                    标签管理
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleDrainDialog(scope.row)"
                  >
                    清空节点
                  </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons" @click="viewYaml(scope.row)">
                    查看YAML
                  </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons"> 删除 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <el-dialog
    :model-value="data.labelData.close"
    style="color: #000000; font: 14px"
    width="720px"
    align-center
    center
    @close="cancelEditLabel"
  >
    <template #header>
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
        标签管理
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        附加到 Kubernetes 对象上的键值对，用于指定对用户有意义且相关的对象的标识属性。
      </div>
    </el-card>

    <el-form style="margin-top: 5px">
      <el-form-item
        v-for="(item, index) in data.labelData.labels"
        :key="index"
        style="margin-top: -10px"
      >
        <el-form-item prop="item.key">
          <el-input v-model="item.key" style="width: 300px" />
        </el-form-item>
        <div>
          <el-input v-model="item.value" style="width: 300px; margin-left: 20px" />
        </div>
        <div
          class="table-inline-btn"
          style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
          @click="deleteLabel(index)"
        >
          删除
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          class="table-inline-btn"
          style="margin-left: -14px; margin-right: -20px; cursor: pointer"
          @click="addLabel"
          >+ 添加</el-button
        >
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelEditLabel">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmEditLabel"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <el-dialog
    :model-value="data.drainData.close"
    style="color: #000000; font: 14px"
    width="530px"
    align-center
    center
  >
    <template #header>
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
        清空节点
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        此操作将清空节点上的 Pod，在节点清空期间，不要求应用具有高可用性。
      </div>
    </el-card>

    <div style="margin-top: -25px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelDrain">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmDrain"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit :yaml-dialog="data.yamlDialog" :yaml="data.yaml"></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTableData, searchData } from '@/utils/utils';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getNodeList, patchNode, getNode, drainNode } from '@/services/kubernetes/nodeService';
import {
  formatterTime,
  runningFormatter,
  formatString,
  formatNodeRole,
  formatNodeIp,
} from '@/utils/formatter';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  loading: false,
  yamlDialog: false,
  yaml: '',
  nodeList: [],

  labelData: {
    close: false,
    name: '',
    labels: [],
  },

  drainData: {
    close: false,
    name: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNodes();
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.nodeList);
};

const getNodes = async () => {
  data.loading = true;
  const [res, err] = await getNodeList(data.cluster);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.nodeList = res.items;
  data.pageInfo.total = data.nodeList.length;
  data.tableData = getTableData(data.pageInfo, data.nodeList);
};

const searchNodes = async () => {
  data.tableData = searchData(data.pageInfo, data.nodeList);
};

const jumpRoute = (row) => {
  router.push({
    name: 'NodeDetail',
    query: {
      cluster: data.cluster,
      name: row.metadata.name,
    },
  });
};

const changeScheduleStatus = async (row) => {
  let patchData = {
    spec: {
      unschedulable: row.spec.unschedulable,
    },
  };
  const [res, err] = await patchNode(data.cluster, row.metadata.name, patchData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
};

const cordon = (row) => {
  if (row.spec.unschedulable === true) {
    return;
  }

  ElMessageBox.confirm('关闭 ' + row.metadata.name + ' 节点调度. 是否继续?', '节点调度', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      const res = await proxy.$http({
        method: 'patch',
        data: {
          spec: {
            unschedulable: true,
          },
        },
        url: `/pixiu/proxy/${data.cluster}/api/v1/nodes/${row.metadata.name}`,
        config: {
          header: {
            'Content-Type': 'application/strategic-merge-patch+json',
          },
        },
      });
      ElMessage({
        type: 'success',
        message: '已关闭 ' + row.metadata.name + ' 节点调度',
      });

      getNodes();
    })
    .catch(() => {});
};

const handleDrainDialog = async (row) => {
  data.drainData.close = true;
  data.drainData.name = row.metadata.name;
};

const cancelDrain = () => {
  data.drainData.close = false;
  data.drainData.name = '';
};

const confirmDrain = async () => {
  const [node, err] = await drainNode(data.cluster, data.drainData.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  cancelDrain();
};

const addLabel = () => {
  data.labelData.labels.push({ key: '', value: '' });
};

const deleteLabel = (index) => {
  data.labelData.labels.splice(index, 1);
};

const handleEditLabelDialog = async (row) => {
  data.labelData.name = row.metadata.name;
  data.labelData.labels = [];

  const [node, err1] = await getNode(data.cluster, data.labelData.name);
  if (err1) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  const labels = node.metadata.labels;
  if (labels !== undefined) {
    for (let label in labels) {
      data.labelData.labels.push({
        key: label,
        value: labels[label],
      });
    }
  }

  data.labelData.close = true;
};

const cancelEditLabel = () => {
  data.labelData.close = false;
  data.labelData.name = '';
  data.labelData.labels = [];
};

const confirmEditLabel = async () => {
  const newLabels = {};
  for (let item of data.labelData.labels) {
    newLabels[item.key] = item.value;
  }

  const [node, err1] = await getNode(data.cluster, data.labelData.name);
  if (err1) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  const oldLabels = node.metadata.labels;
  for (let key in oldLabels) {
    if (key in newLabels) {
      continue;
    }
    newLabels[key] = null;
  }

  const patchData = {
    metadata: {
      labels: newLabels,
    },
  };
  const [res, err] = await patchNode(data.cluster, data.labelData.name, patchData);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  cancelEditLabel();
};

const viewYaml = async (row) => {
  data.labelData.name = row.metadata.name;

  const [node, err] = await getNode(data.cluster, data.labelData.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.yamlDialog = true;
  data.yaml = node;
};
</script>

<style scoped="scoped"></style>
