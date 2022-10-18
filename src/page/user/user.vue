<template>
  <el-main>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button type="primary" @click="createUser" style="margin-left: 1px" v-permissions="'user:cloud:add'">
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component is="Plus" />
            </el-icon>
            添加用户
          </el-button>

          <el-input placeholder="多个过滤标签用回车分隔" v-model="data.pageInfo.query" style="width: 560px; float: right" clearable
            @input="getUserList" @clear="getUserList" :suffix-icon="Search">
            <template #suffix>
              <el-icon class="el-input__icon">
                <component is="Search" />
              </el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table :data="data.userList" stripe style="margin-top: 2px; width: 100%" v-loading="loading"
          @selection-change="handleSelectionChange">
          <el-table-column prop="id" label="用户ID" width="200" />
          <el-table-column prop="name" label="用户名" width="180" />
          <el-table-column prop="description" label="描述" width="180" />
          <el-table-column prop="gmt_create" label="创建时间" width="200" />
          <el-table-column prop="email" label="Email" width="160" />
          <el-table-column prop="status" label="状态" width="160">
            <template #default="scope">
              <el-switch v-model="scope.row.status" class="ml-2"
                style="--el-switch-on-color: #409EFF; --el-switch-off-color: #ff4949" :active-value="1"
                :inactive-value="0" size="small" inline-prompt active-text="启用" inactive-text="禁用" width="45px" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <el-button size="small" type="text" style="color: #006eff" @click="getRoleByUser(scope.row)"
                v-permissions="'user:cloud:setting'">
                分配角色
              </el-button>

              <el-button type="text" size="small" @click="deleteUser(scope.row)"
                style="margin-right: 10px; color: #006eff" v-permissions="'user:cloud:delete'">
                删除
              </el-button>
              <el-button type="text" size="small" @click="updateUser(scope.row)"
                style="margin-right: 10px; color: #006eff" v-permissions="'user:cloud:delete'">
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>

 
      </el-card>
    </div>
  </el-main>
  <!-- 添加用户信息 -->
  <el-dialog v-model="data.createUserVisible" style="color: #000000; font: 14px" width="360px" center
    @close="data.createUserVisible = false">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        添加用户
      </div>
    </template>
    <el-form :label-position="labelPosition" label-width="100px" :model="data.userForm" style="max-width: 260px">
      <el-form-item label="名字:" required>
        <el-input v-model="data.userForm.name" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="data.userForm.description" required="" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="data.userForm.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="data.userForm.status" class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value="1" :inactive-value="0"
          size="large" inline-prompt active-text="启用" inactive-text="禁用" />

      </el-form-item>

      <el-form-item label="密码" required>
        <el-input v-model="data.userForm.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="再次输入密码" required>
        <el-input v-model="data.confirmPassword" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createUserVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateUser">创建</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改用户信息 -->
  <el-dialog v-model="data.updateUserVisible" style="color: #000000; font: 14px" width="360px" center
    @close="data.updateUserVisible = false">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        修改用户
      </div>
    </template>
    <el-form :label-position="labelPosition" label-width="100px" :model="data.updateForm" style="max-width: 260px">
      <el-form-item label="名字:" required>
        <el-input v-model="data.updateForm.name" />
      </el-form-item>
      <el-form-item label="描述:">
        <el-input v-model="data.updateForm.description" required="" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="data.updateForm.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="data.updateForm.status" class="ml-2"
          style="--el-switch-on-color: #409EFF; --el-switch-off-color: #ff4949" :active-value="1" :inactive-value="0"
          size="large" inline-prompt active-text="启用" inactive-text="禁用" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="data.updateForm.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="再次输入密码">
        <el-input v-model="data.confirmPassword" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.updateUserVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdateUser()">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 分配角色 -->
  <el-dialog v-model="data.setRoleVisible" style="color: #000000; font: 14px" width="360px" center
    @close="data.setRoleVisible = false">
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">
        分配角色
      </div>
    </template>
    <div>
      <el-tree ref="menusRef" node-key="id" 
      :data="data.roleList" 
      :default-checked-keys="data.roles" 
      check-strictly
        default-expand-all show-checkbox>
        <template #default="{ data: { name } }">
          {{ name }}</template>
      </el-tree>
      <el-divider />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.setRoleVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetRole()">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>
  
<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {userEdit} from './userEdit.vue'
const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: "",
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },

  isActive: false,
  loading: false,
  // 触发创建页面
  createUserVisible: false,
  updateUserVisible: false,
  setRoleVisible: false,
  props: { multiple: true },
  userStatus: {
    0: "正常",
    1: "异常",
  },
  userForm: {
    description: "",
    email: "",
    name: "",
    password: "",
    status: 1
  },
  updateForm: {},
  confirmPassword: "",
  userList: [],
  autosize: {
    minRows: 8,
  },
  roleList: [],
  roleForm: {
    role_ids: [],
  },
  roles: [],
});

onMounted(() => {
  getUserList();
  getRoles();
});

const getUserList = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: "get",
    url: "/users",
    data: data.pageInfo,
  });

  data.loading = false;
  data.userList = res.result
}


const deleteUser = async (row) => {
  ElMessageBox.confirm(
    "此操作将删除 " + row.name + "用户 . 是否继续?",
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
          url: "/users/" + row.id,
        })
        .then((res) => {
          getUserList();
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

const createUser = () => {
  data.createUserVisible = true;
};

const updateUser = (user) => {
  data.updateUserVisible = true;
  data.updateForm = user
};

const confirmCreateUser = async () => {
  console.log(data.userForm);
  const resp = await proxy.$http({
    method: "post",
    url: "/users",
    data: data.userForm,
  });
  data.createUserVisible = false
  if (resp.code === 200) {
    getUserList();
    ElMessage({
      type: "success",
      message: "添加成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "添加失败",
    });
  }
};

const confirmUpdateUser = async () => {

  console.log("--", data.userForm);
  const resp = await proxy.$http({
    method: "put",
    url: "/users/" + data.updateForm.id,
    data: data.updateForm,
  });
  data.updateUserVisible = false
  if (resp.code === 200) {
    getUserList();
    ElMessage({
      type: "success",
      message: "修改成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "修改失败",
    });
  }
}

const getRoles = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: "get",
    url: "/roles",
  });
  data.roleList = res.result
  data.loading = false;
}



const getRoleByUser = async (user) => {
  data.loading = true;
  data.updateForm = user
  data.roles = [];
  const res = await proxy.$http({
    method: "get",
    url: "/users/" + data.updateForm.id + "/roles",
  });

  data.loading = false;
  let roleList = res.result
  if (roleList !== null) {
    for (let i = 0; i < roleList.length; i++) {
      if (roleList.children ) {
        for (let j = 0; j < roleList.children.length; j ++) {
          data.roles.push(roleList.children[i].id)
        }
      }
      data.roles.push(roleList[i].id)
    }
  }
  console.log(data.roles);
  data.setRoleVisible = true;
}
const menusRef = ref(null);

const confirmSetRole = async () => {
  data.loading = true;
  const menuIds = menusRef.value.getCheckedKeys();
  data.roleForm["role_ids"] = menuIds
  const res = await proxy.$http({
    method: "post",
    url: "/users/" + data.updateForm.id + "/roles",
    data: data.roleForm,
  });
  data.setRoleVisible = false
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "分配成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: res.message,
    });
  }
  data.roles= []
  data.loading = false;
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
  