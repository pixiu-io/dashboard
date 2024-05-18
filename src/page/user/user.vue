<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 用户列表 </span>
    </el-card>

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'cloud:user:add'"
            type="primary"
            class="pixiu-button"
            style="margin-left: 1px"
            @click="handleCreateDialog"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            新建用户
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
              />

              <!-- <el-icon class="el-input__icon" @click="cloudStore.getCloudList">
                <component :is="'Search'" />
              </el-icon> -->
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="data.loading"
          :data="data.userList"
          stripe
          style="margin-top: 2px; width: 100%"
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="用户名称" sortable>
            <template #default="scope">
              <el-link class="global-table-world" type="primary" :underline="false">
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          />
          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="description" label="描述" />

          <el-table-column fixed="right" label="操作" width="150px">
            <template #default="scope">
              <el-button
                v-permissions="'cloud:user:edit'"
                text
                size="small"
                style="margin-right: -25px; margin-left: -10px; color: #006eff"
                @click="handleDialogValue(scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-permissions="'cloud:user:delete'"
                text
                size="small"
                style="margin-right: -2px; color: #006eff"
                @click="handleDeleteDialog(scope.row)"
              >
                删除
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
                      @click="handleEditYamlDialog(scope.row)"
                    >
                      更新密码
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <div class="table-inline-word">暂无用户</div>
          </template>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
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
    v-model="data.createDialog.close"
    style="color: #000000; font: 14px"
    width="390px"
    draggable
    center
    @close="handleCreateCloseDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">新建用户</div>
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
        <el-button class="pixiu-small-cancel-button" @click="handleCreateCloseDialog"
          >取消</el-button
        >
        <el-button class="pixiu-small-confirm-button" type="primary" @click="confirmCreateUser"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatterTime } from '@/utils/formatter';
import UserEdit from './userEdit.vue';
import UserSetRole from './userSetRole.vue';
import Pagination from '@/components/pagination/index.vue';
import { GetUserList, deleteUser, createUser } from '@/services/user/userService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

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

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  tableData: [],
  userList: [],

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
    minRows: 8,
  },

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '用户',
    deleteName: '',
  },

  // 创建属性
  createDialog: {
    close: false,
  },
  userForm: {
    description: '',
    email: '',
    name: '',
    password: '',
    status: 1,
    confirmPassword: '',
  },
});

onMounted(() => {
  getUserList();
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

// 分页
const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  getUserList();
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.id;
};

const confirm = async () => {
  const [result, err] = await deleteUser(data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err);
    return;
  }
  proxy.$message.success(`User(${data.deleteDialog.deleteName}) 删除成功`);

  clean();
  getUserList();
};

const cancel = () => {
  data.deleteDialog.close = false;
  // 延迟 1 秒重置数据，否则页面上会显的很怪
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 1000);
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
  data.loading = true;
  const [result, err] = await GetUserList();
  if (err) {
    proxy.$message.error(err);
    return;
  }
  data.loading = false;

  data.userList = result;
  data.pageInfo.total = result.length;
};

// 开始 创建用户
const handleCreateDialog = () => {
  data.createDialog.close = true;
};

const handleCreateCloseDialog = () => {
  data.createDialog.close = false;

  // 初始化创建form
  setTimeout(() => {
    data.userForm = {
      description: '',
      email: '',
      name: '',
      password: '',
      status: 1,
      confirmPassword: '',
    };
  }, 1000);
};

const confirmCreateUser = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      const [result, err] = await createUser(data.userForm, false);
      if (err) {
        proxy.$notify.error({ message: err });
        return;
      }
      proxy.$notify.success({ message: `用户(${data.userForm.name})创建成功` });
      handleCreateCloseDialog();
    }
  });
};
// 结束 创建用户

const handleDialogValue = (user) => {
  userEdit.dialogTableValue = JSON.parse(JSON.stringify(user));
  userEdit.dialogVisble = true;
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

<style></style>
