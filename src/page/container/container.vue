<template>
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
          @click="handleCreate"
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

        <el-table-column prop="status" label="状态" width="200" />
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
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        style="
          float: right;
          margin-right: 40px;
          margin-top: 20px;
          margin-bottom: 20px;"
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
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: "",
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },

  loading: false,

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
  ],
});

onMounted(() => {
  getCloudList();
});

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
      name: row.name
    },
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
</style>
