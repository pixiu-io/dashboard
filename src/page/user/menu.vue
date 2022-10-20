<template>
  <el-main>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="createRole()"
            style="margin-left: 1px"
            v-permissions="'user:cloud:add'"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component is="Plus" />
            </el-icon>
            添加菜单权限
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          :data="data.menuList"
          stripe
          style="margin-top: 2px; width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column prop="id" label="菜单ID" width="180" />
          <el-table-column prop="name" label="菜单名称" width="120" />
          <el-table-column prop="menu_type" label="类型" width="80">
            <template #default="scope">
              <span style="font-size: 13px" v-if="scope.row.menu_type === 1">
                <el-tag class="ml-2" type="success" effect="dark">菜单</el-tag>
              </span>
              <span style="font-size: 13px" v-if="scope.row.menu_type === 2">
                <el-tag class="ml-2" type="warning" effect="dark">按钮</el-tag>
              </span>
              <span style="font-size: 13px" v-if="scope.row.menu_type === 3">
                <el-tag class="ml-2" effect="dark">API</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="描述" width="120" />
          <el-table-column prop="url" label="URL" width="250" />
          <el-table-column prop="code" label="Code" width="200" />

          <el-table-column prop="method" label="请求方式" width="200">
            <template #default="scope">
              <span
                style="font-size: 13px"
                text="bold"
                v-if="scope.row.method === 'GET'"
              >
                <el-tag class="ml-2">{{ scope.row.method }}</el-tag>
              </span>
              <span style="font-size: 13px" v-if="scope.row.method === 'POST'">
                <el-tag class="ml-2" type="success">{{
                  scope.row.method
                }}</el-tag>
              </span>
              <span
                style="font-size: 13px"
                v-if="scope.row.method === 'DELETE'"
              >
                <el-tag class="ml-2" type="danger">{{
                  scope.row.method
                }}</el-tag>
              </span>
              <span style="font-size: 13px" v-if="scope.row.method === 'PUT'">
                <el-tag class="ml-2" type="warning">{{
                  scope.row.method
                }}</el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="icon" label="图标" width="180">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                style="
                  --el-switch-on-color: #409eff;
                  --el-switch-off-color: #ff4949;
                "
                :active-value="1"
                :inactive-value="0"
                size="small"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
                width="45px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="sequence" label="排序" width="80" />
          <el-table-column prop="gmt_create" label="创建时间" width="220" />
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <RoleSetPermission
                :roleMenus="data.menus"
                :role="data.role"
                :menuList="data.menuList"
                ref="roleSetPermissionDoalog"
              ></RoleSetPermission>
              <el-button
                size="small"
                text
                style="color: #006eff"
                @click="getMenusByUser2(scope.row)"
                v-permissions="'user:cloud:setting'"
              >
                授权
              </el-button>

              <el-button
                text
                size="small"
                @click="deleteMenu(scope.row)"
                style="margin-right: 10px; color: #006eff"
                v-permissions="'user:cloud:delete'"
              >
                删除
              </el-button>

              <roleEdit
                :role="data.role"
                :roleList="data.roleList"
                ref="roleDialog"
              ></roleEdit>
              <el-button
                text
                size="small"
                @click="updateRole(scope.row)"
                style="margin-right: 10px; color: #006eff"
                v-permissions="'user:cloud:delete'"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </el-main>

  <!-- 添加菜单按钮信息 -->
  <el-dialog
    v-model="data.createMenuVisible"
    style="color: #000000; font: 14px"
    width="460px"
    center
    @close="data.createMenuVisible = false"
  >
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        添加菜单权限
      </div>
    </template>

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="data.menuForm"
      style="max-width: 360px"
    >
      <el-form-item label="菜单类型:" required>
        <el-radio-group v-model="data.menuForm.menu_type">
          <el-radio-button label="1">菜单</el-radio-button>
          <el-radio-button label="2">按钮</el-radio-button>
          <el-radio-button label="3">API</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称:" required>
        <el-input v-model="data.menuForm.name" />
      </el-form-item>

      <el-form-item label="上一级:">
        <el-tree-select
          ref="selectRef"
          v-model="data.menuForm.parent_id"
          :data="data.menuList"
          check-strictly
          clearable
          :render-after-expand="false"
          node-key="id"
        >
          <template #default="{ data: { name } }">
            {{ name }}
          </template>
        </el-tree-select>
      </el-form-item>

      <el-form-item label="描述:">
        <el-input v-model="data.menuForm.memo" required="" />
      </el-form-item>
      <el-form-item label="排序值:">
        <el-input-number
          v-model="data.menuForm.sequence"
          :min="1"
          :max="10"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="URL:">
        <el-input v-model="data.menuForm.url" />
      </el-form-item>
      <el-form-item label="Method:">
        <el-select
          v-model="data.menuForm.method"
          clearable
          placeholder="Select"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图标:">
        <el-input v-model="data.menuForm.icon" required="" />
      </el-form-item>
      <el-form-item label="Code:">
        <el-input v-model="data.menuForm.code" required="" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="data.menuForm.status"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-value="1"
          :inactive-value="0"
          size="large"
          inline-prompt
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createMenuVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateMenus">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import roleEdit from "./roleEdit.vue";
import RoleSetPermission from "./roleSetPermission.vue";

const name = ref(null);
const selectRef = ref(null);

const roleDialog = ref(false);
const roleSetPermissionDoalog = ref(false);

let methodOptions = [
  {
    value: "GET",
    label: "GET",
  },
  {
    value: "POST",
    label: "POST",
  },
  {
    value: "DELETE",
    label: "DELETE",
  },
  {
    value: "PUT",
    label: "PUT",
  },
];

const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: "",
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },
  loading: false,
  // 触发创建页面
  createMenuVisible: false,
  menuForm: {
    memo: "",
    parent_id: 0,
    name: "",
    sequence: "",
    status: 1,
    menu_type: 1,
    icon: "",
    code: "",
    method: "",
  },
  name: "",
  roleList: [],
  menus: [],
  menuList: [],
});

onMounted(() => {
  getMenusList();
});

const deleteMenu = async (row) => {
  ElMessageBox.confirm(
    "此操作将删除 " + row.name + "菜单 . 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
    }
  )
    .then(() => {
      const res = proxy
        .$http({
          method: "delete",
          url: "/menus/" + row.id,
        })
        .then(() => {
          getMenusList();
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

const createRole = () => {
  data.createMenuVisible = true;
};

const updateRole = (role) => {
  roleDialog.value.dialogVisble = true;
  data.role = role;
};

const confirmCreateMenus = async () => {
  data.menuForm.menu_type = parseInt(data.menuForm.menu_type);
  console.log(data.menuForm);
  const resp = await proxy.$http({
    method: "post",
    url: "/menus",
    data: data.menuForm,
  });
  data.createMenuVisible = false;
  if (resp.code === 200) {
    getMenusList();
    ElMessage({
      type: "success",
      message: "添加成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: resp.message,
    });
  }
};

const getMenusList = async () => {
  const res = await proxy.$http({
    method: "get",
    url: "/menus",
  });
  data.menuList = res.result;
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
