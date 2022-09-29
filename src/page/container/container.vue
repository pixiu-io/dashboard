<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <el-row>
        <el-col>
          <span
            style="font-weight: bold; font-size: 18px; vertical-align: middle"
          >
            容器服务
          </span>
          <span
            style="
              font-size: 12px;
              margin-left: 10px;
              vertical-align: middle;
              margin-right: 10px;
            "
          >
            地域
          </span>

          <el-select
            v-model="data.value"
            placeholder="Select"
            style="width: 100px"
          >
            <el-option
              v-for="item in data.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>

          <span
            style="
              font-size: 12px;
              float: right;
              color: rgba(0, 0, 0, 0.9);
              vertical-align: middle;
              margin-left: 5px;
            "
          >
            管理指南
            <el-icon style="vertical-align: middle; margin-right: 10px">
              <component is="Edit" />
            </el-icon>
          </span>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="app-docs">
      <div style="vertical-align: middle; margin-top: -10px">
        已有超级节点能力全面升级，支持更多集群版本
      </div>
    </el-card>

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="createCloud"
            style="margin-left: 1px"
            v-permissions="'user:cloud:add'"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component is="Plus" />
            </el-icon>
            新建集群
          </el-button>

          <el-input
            placeholder="多个过滤标签用回车分隔"
            v-model="data.pageInfo.query"
            style="width: 560px; float: right"
            clearable
            @input="getCloudList"
            @clear="getCloudList"
            :suffix-icon="Search"
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <component is="Search" />
              </el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          :data="data.cloudList"
          stripe
          style="margin-top: 2px; width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="38" /> -->

          <el-table-column prop="name" label="名称/ID" width="200">
            <template #default="scope">
              <el-link
                style="color: #006eff"
                type="primary"
                @click="jumpRoute(scope.row)"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            :formatter="cloudStatusFormatter"
            prop="status"
            label="状态"
            width="200"
          />
          <el-table-column prop="cloud_type" label="集群类型" width="200" />
          <el-table-column
            prop="kube_version"
            label="kubernetes版本"
            width="200"
          />
          <el-table-column prop="node_number" label="节点数" width="200" />
          <el-table-column prop="resources" label="资源量" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="color: #006eff"
                @click="handleEdit(scope.row)"
                v-permissions="'user:cloud:setting'"
              >
                设置
              </el-button>

              <el-button
                type="text"
                size="small"
                @click="deleteCloud(scope.row)"
                style="margin-right: 10px; color: #006eff"
                v-permissions="'user:cloud:delete'"
              >
                删除
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item style="color: #006eff">
                      启动
                    </el-dropdown-item>
                    <el-dropdown-item style="color: #006eff">
                      详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template v-slot:empty>
            <div style="text-align: center">
              没有任何容器集群
              <button @click="createCloud" class="app-pixiu-btn--link">
                [立即创建]
              </button>
            </div>
          </template>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          style="
            float: right;
            margin-right: 40px;
            margin-top: 20px;
            margin-bottom: 20px;
          "
          :current-page="data.pageInfo.page"
          :page-size="data.pageInfo.limit"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
  </el-main>

  <el-dialog
    v-model="data.createCloudVisible"
    style="color: #000000; font: 14px"
    width="1200px"
    center
    @close="data.createCloudVisible = false"
  >
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        选择集群类型
      </div>
    </template>
    <el-row :gutter="20">
      <pixiu-radio-card
        :type="1"
        :defaultType="data.cloudType"
        @click="changeActive"
        :span="2"
        ><div>
          <div
            style="
              margin-top: 10px;
              font: 14px;
              font-weight: 700;
              color: #000000;
            "
          >
            标准集群
          </div>

          <div
            style="
              margin-top: 20px;
              font: 12px;
              color: #00000066;
              /* padding-left: 10px;
              position: relative; */
            "
          >
            可以将用户本地基础设施的 Kubernetes 集群或者其他云厂商的 Kubernetes
            集群注册到容器服务进行统一管理。
          </div>
          <div style="margin-top: 20px; color: #000 !important">
            多云管理，灵活接入各种计算资源
          </div>
          <div style="margin-top: 8px; color: #000 !important">
            对接现有 DevOps 系统，实现多云发布
          </div>
          <div style="margin-top: 8px; color: #000 !important">
            完全兼容开源 Kubernetes 集群
          </div>
          <div
            style="
              margin-top: 20px;
              color: #000 !important;
              margin-bottom: 50px;
            "
          >
            生态开源 多云管理
          </div>
        </div></pixiu-radio-card
      >

      <pixiu-radio-card
        :type="2"
        :defaultType="data.cloudType"
        @click="changeActive"
        :span="2"
      >
        <div
          style="margin-top: 10px; font: 14px; font-weight: 700; color: #000000"
        >
          自建集群
        </div>

        <div style="margin-top: 20px; font: 12px; color: #00000066">
          默认集群类型，完全兼容开源 Kubernetes
          集群标准功能，并强化节点管理、集群网络、容器调度等能力。
        </div>

        <div style="margin-top: 20px; color: #000 !important">
          标准原生 Kubernets 集群、丰富的自定义接口
        </div>
        <div style="margin-top: 8px; color: #000 !important">
          适用于高稳定性、定制化集群业务
        </div>
        <div style="margin-top: 8px; color: #000 !important">
          灵活的集群网络、容器调度
        </div>
        <div
          style="margin-top: 20px; color: #000 !important; margin-bottom: 50px"
        >
          标准K8s集群 支持原生节点
        </div>
      </pixiu-radio-card>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createCloudVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateCloud">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PixiuRadioCard from "@/components/radioCard/index.vue";
const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: "",
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },

  isActive: false,
  cloudType: 1,
  loading: false,

  cloudStatus: {
    0: "正常",
    1: "异常",
    2: "构建中",
    3: "删除中",
  },

  // 触发创建页面
  createCloudVisible: false,

  cloudList: [], // k8s 集群列表

  autosize: {
    minRows: 8,
  },
  value: "无锡",
  options: [
    {
      value: "无锡",
      label: "无锡",
    },
    {
      value: "宿迁",
      label: "宿迁",
    },
    {
      value: "杭州",
      label: "杭州",
      disabled: true,
    },
    {
      value: "泗阳",
      label: "泗阳",
    },
  ],
});

onMounted(() => {
  getCloudList();
});

const changeActive = (value) => {
  data.cloudType = value;
};

const cloudStatusFormatter = (row, column, cellValue) => {
  return data.cloudStatus[cellValue];
};

const getCloudList = async () => {
  // TODO 考虑将loading取到全局上面来，避免过多的去写loading状态管理
  data.loading = true;
  const res = await proxy.$http({
    method: "get",
    url: "/clouds",
    data: data.pageInfo,
  });
  data.loading = false;

  data.cloudList = res.result.data;
  data.total = res.result.total;
};

const jumpRoute = (row) => {
  proxy.$router.push({
    name: "Kubernetes",
    params: {
      id: row.id,
      name: row.name,
    },
  });
};

const createCloud = () => {
  data.createCloudVisible = true;
  data.cloudType = 1;
};

// 根据选择的类型跳转到不同操作页面
const confirmCreateCloud = () => {
  proxy.$router.push({
    name: data.cloudType == 1 ? "InsertCluster" : "CreateCluster",
  });
};

const handleSizeChange = (newSize) => {
  data.pageInfo.page_size = newSize;
  getCloudList();
};

const handleCurrentChange = (newPage) => {
  this.pageInfo.page = newPage;
  getCloudList();
};

// 删除cloud
// TODO: 待优化
const deleteCloud = async (row) => {
  ElMessageBox.confirm(
    "此操作将永久删除 " + row.name + " 集群. 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
    }
  )
    .then(() => {
      proxy
        .$http({
          method: "delete",
          url: "/clouds/" + row.id,
        })
        .then((res) => {
          getCloudList();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err,
          });
        });
    })
    .catch(() => {}); // 取消
};
</script>

<style>
.box-card {
  margin-top: 20px;
  /* width: 480px; */
}
.el-main {
  background-color: #f3f4f7;
}
.app-docs {
  margin-top: 20px;
  height: 60px;
  font-size: 12px;
  line-height: inherit;
  padding: 14px 20px;
  vertical-align: middle;
  color: #002da0;
  border: 1px solid #d5e7ff;
  border-radius: 0;
  background: #d5e7ff;
  position: relative;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #006eff;
  display: flex;
  font-size: 12px;
  margin-top: 6px;
}
.dropdown-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.app-pixiu-btn--link {
  text-align: center;
  height: auto;
  padding: 0;
  vertical-align: middle;
  line-height: 1.5;
  border: none;
  color: #006eff;
  margin-left: 2px;
  background-color: #fff;
  cursor: pointer;
}
</style>
