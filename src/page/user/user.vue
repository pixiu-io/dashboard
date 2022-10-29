<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 用户列表 </span>
    </el-card>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'cloud:user:add'"
            type="primary"
            style="margin-left: 1px"
            @click="createUser"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="loading"
          :data="data.userList"
          stripe
          style="margin-top: 2px; width: 100%"
        >
          <el-table-column prop="id" label="用户ID" width="200" />
          <el-table-column prop="name" label="用户名" width="180" />
          <el-table-column prop="description" label="描述" width="180" />
          <el-table-column prop="gmt_create" label="创建时间" width="200" />
          <el-table-column prop="email" label="Email" width="160" />
          <el-table-column prop="status" label="状态" width="160">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                style="--el-switch-on-color: #409eff; --el-switch-off-color: #ff4949"
                :active-value="1"
                :inactive-value="0"
                size="small"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
                width="45px"
                @change="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <el-button
                v-permissions="'cloud:role:set'"
                size="small"
                text
                style="color: #006eff"
                @click="handleSetRole(scope.row)"
              >
                分配角色
              </el-button>

              <el-button
                v-permissions="'cloud:user:delete'"
                text
                size="small"
                style="margin-right: 10px; color: #006eff"
                @click="deleteUser(scope.row)"
              >
                删除
              </el-button>

              <el-button
                v-permissions="'cloud:user:edit'"
                text
                size="small"
                style="margin-right: 10px; color: #006eff"
                @click="handleDialogValue(scope.row)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.total" @on-change="onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <UserSetRole
    v-if="userSetRole.dialogVisble"
    v-model="userSetRole.dialogVisble"
    :default-checked-roles="userSetRole.defaultCheckedRoles"
    :user="userSetRole.user"
    :role-list="userSetRole.roleList"
    @value-change="getRoles"
  />

  <UserEdit
    v-if="userEdit.dialogVisble"
    v-model="userEdit.dialogVisble"
    :dialog-table-value="userEdit.dialogTableValue"
    @value-change="getUserList"
  />
  <!-- 添加用户信息 -->
  <el-dialog
    v-model="data.createUserVisible"
    style="color: #000000; font: 14px"
    width="390px"
    center
    @close="data.createUserVisible = false"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">添加用户</div>
    </template>
    <el-form
      ref="userFormRef"
      :label-position="labelPosition"
      :rules="userFormRules"
      label-width="110px"
      :model="data.userForm"
      style="max-width: 290px"
    >
      <el-form-item label="名字:" required prop="name">
        <el-input v-model="data.userForm.name" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="data.userForm.description" required="" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="data.userForm.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="data.userForm.status"
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
      <el-form-item label="密码" required prop="password">
        <el-input v-model="data.userForm.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="再次输入密码" prop="confirmPassword">
        <el-input v-model="data.userForm.confirmPassword" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createUserVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateUser">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import UserEdit from './userEdit.vue';
import UserSetRole from './userSetRole.vue';
import Pagination from '@/components/pagination/index.vue';

const loading = ref(false);
const userFormRef = ref(null);
const userEdit = reactive({
  dialogVisble: false,
  dialogTableValue: {},
});
const userSetRole = reactive({
  dialogVisble: false,
  dialogTableValue: {},
  defaultCheckedRoles: [],
  updateForm: {},
  roleList: [],
  user: {},
});
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (data.userForm.confirmPassword !== '') {
      if (!userFormRef.value) return;
      userFormRef.value.validateField('confirmPassword', () => null);
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== data.userForm.password) {
    callback(new Error('两次密码不匹配'));
  } else {
    callback();
  }
};

const validateEmail = (rule, value, callback) => {
  const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value) {
    if (regEmail.test(value)) {
      return callback();
    }
    callback(new Error('请输入正确的邮箱'));
  }
};

const userFormRules = reactive({
  name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度在6到12位之间', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
});

const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    query: '',
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },

  loading: false,
  // 触发创建页面
  createUserVisible: false,
  userForm: {
    description: '',
    email: '',
    name: '',
    password: '',
    status: 1,
    confirmPassword: '',
  },
  updateForm: {},
  userList: [],
  autosize: {
    minRows: 8,
  },
});

onMounted(() => {
  getUserList();
  getRoles();
});

// 分页
const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;
  getUserList();
};

const changeStatus = async (user) => {
  const res = await proxy.$http({
    method: 'put',
    url: `/users/${user.id}/status/${user.status}`,
  });

  if (res.code === 200) {
    getUserList();
    ElMessage({
      type: 'success',
      message: '更新成功',
    });
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    });
  }
};

const getUserList = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: '/users',
    data: data.pageInfo,
  });

  data.userList = res.users;
  data.total = res.total;
};

const deleteUser = async (row) => {
  ElMessageBox.confirm(`此操作将删除 ${row.name}用户 . 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {
      proxy
        .$http({
          method: 'delete',
          url: `/users/${row.id}`,
        })
        .then(() => {
          getUserList();
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        })
        .catch((err) => {
          ElMessage({
            type: 'error',
            message: err,
          });
        });
    })
    .catch(() => {}); // 取消
};

const createUser = () => {
  data.createUserVisible = true;
};

const handleDialogValue = (user) => {
  userEdit.dialogTableValue = JSON.parse(JSON.stringify(user));
  userEdit.dialogVisble = true;
};

const confirmCreateUser = async () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      try {
        proxy
          .$http({
            method: 'post',
            url: '/users',
            data: data.userForm,
          })
          .then(() => {
            data.createUserVisible = false;
            getUserList();
            ElMessage({
              type: 'success',
              message: '添加成功',
            });
          });
      } catch (err) {}
    } else {
      ElMessage.error('请正确填写');
    }
  });
};

const getRoles = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: '/roles',
  });
  userSetRole.roleList = res.roles;
};

const handleSetRole = async (user) => {
  userSetRole.user = user;
  userSetRole.defaultCheckedRoles = [];
  const res = await proxy.$http({
    method: 'get',
    url: `/users/${userSetRole.user.id}/roles`,
  });

  // 提取role id
  const roleList = res;
  if (roleList !== null) {
    for (let i = 0; i < roleList.length; i++) {
      if (roleList[i].children !== null) {
        for (let j = 0; j < roleList[i].children.length; j++) {
          userSetRole.defaultCheckedRoles.push(roleList[i].children[j].id);
        }
      }
      userSetRole.defaultCheckedRoles.push(roleList[i].id);
    }
  }
  userSetRole.dialogVisble = true;
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
