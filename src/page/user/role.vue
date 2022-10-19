<template>
  <el-main>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button type="primary" @click="createRole()" style="margin-left: 1px" v-permissions="'user:cloud:add'">
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component is="Plus" />
            </el-icon>
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table :data="data.roleList" stripe style="margin-top: 2px; width: 100%" v-loading="loading"
          @selection-change="handleSelectionChange" row-key="id">
          <el-table-column prop="id" label="角色ID" width="200" />
          <el-table-column prop="name" label="角色名" width="180" />
          <el-table-column prop="memo" label="描述" width="180" />
          <el-table-column prop="gmt_create" label="创建时间" width="200" />
          <el-table-column prop="status" label="状态" width="160">
            <template #default="scope">
              <el-switch v-model="scope.row.status" class="ml-2"
                style="--el-switch-on-color: #409EFF; --el-switch-off-color: #ff4949" :active-value="1"
                :inactive-value="0" size="small" inline-prompt active-text="启用" inactive-text="禁用" width="45px" />
            </template>
          </el-table-column>
          <el-table-column prop="sequence" label="排序" width="180" />
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <RoleSetPermission :roleMenus="data.menus" :role="data.role" :menuList="data.menuList" ref="roleSetPermissionDoalog"></RoleSetPermission>
              <el-button size="small" type="text" style="color: #006eff" @click="getMenusByUser(scope.row)"
                v-permissions="'user:cloud:setting'">
                授权
              </el-button>

              <el-button type="text" size="small" @click="deleteRole(scope.row)"
                style="margin-right: 10px; color: #006eff" v-permissions="'user:cloud:delete'">
                删除
              </el-button>

              <roleEdit :role="data.role" :roleList="data.roleList" ref="roleDialog"></roleEdit>
              <el-button type="text" size="small" @click="updateRole(scope.row)"
                style="margin-right: 10px; color: #006eff" v-permissions="'user:cloud:delete'">
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
    </div>
  </el-main>


  <!-- 添加角色信息 -->
  <el-dialog v-model="data.createRoleVisible" style="color: #000000; font: 14px" width="360px" center
    @close="data.createRoleVisible = false">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        添加角色
      </div>
    </template>
    <el-form :label-position="labelPosition" label-width="100px" :model="data.roleForm" style="max-width: 260px">
      <el-form-item label="名称:" required>
        <el-input v-model="data.roleForm.name" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="data.roleForm.memo" required="" />
      </el-form-item>
      <el-form-item label="排序值:">
        <el-input-number v-model="data.roleForm.sequence" :min="1" :max="10" @change="handleChange" />
      </el-form-item>
      <el-form-item label="父角色:" >
        <el-select v-model="data.roleForm.parent_id" clearable placeholder="请选择">
          <el-option v-for="item in data.roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

      </el-form-item>
      <el-form-item label="状态:">
        <el-switch v-model="data.roleForm.status" class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value="1" :inactive-value="0"
          size="large" inline-prompt active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>



    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createRoleVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateRole">创建</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import roleEdit from './roleEdit.vue'
import RoleSetPermission from './roleSetPermission.vue'

const roleDialog = ref(false)
const roleSetPermissionDoalog = ref(false)

const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: "",
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },
  loading: false,
  // 触发创建页面
  createRoleVisible: false,
  roleForm: {
    memo: "",
    parent_id: 0,
    name: "",
    sequence: "",
    status: 1
  },
  
  roleList: [],
  role: {},
  menus: [],
  menuList: [],
});

onMounted(() => {
  getRoleList();
  getMenus();
});

const getRoleList = async () => {
  const res = await proxy.$http({
    method: "get",
    url: "/roles",
    data: data.pageInfo,
  });

  data.roleList = res.result
}

const deleteRole = async (row) => {
  ElMessageBox.confirm(
    "此操作将删除 " + row.name + "角色 . 是否继续?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
    }
  )
    .then(() => {
      const res =proxy
        .$http({
          method: "delete",
          url: "/roles/" + row.id,
        })
        .then(() => {
            getRoleList();
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
    .catch(() => { }); // 取消
};

const createRole = () => {
  data.createRoleVisible = true;
};

const updateRole = (role) => {
  roleDialog.value.dialogVisble = true;
  data.role = role;
};

const confirmCreateRole = async () => {
 
  const resp = await proxy.$http({
    method: "post",
    url: "/roles",
    data: data.roleForm,
  });
  data.createRoleVisible = false
  if (resp.code === 200) {
    getRoleList();
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

const getMenus = async () => {
  const res = await proxy.$http({
    method: "get",
    url: "/menus",
  });
  data.menuList = res.result
}

const getMenusByUser = async (role) => {
  data.menus = [];
  data.role = role;
  const res = await proxy.$http({
    method: "get",
    url: "/roles/" + data.role.id + "/menus",
  });

  let menuList = res.result
  if (menuList !== null) {
    for (let i = 0; i < menuList.length; i++) {
      data.menus.push(menuList[i].id)
      if (menuList[i].children !== null) {
        for (let j = 0; j < menuList[i].children.length; j++) {
          data.menus.push(menuList[i].children[j].id)
        }
      }
    }
  };

 
  roleSetPermissionDoalog.value.dialogVisble = true;
}


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

.example-showcase .el-dropdown+.el-dropdown {
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