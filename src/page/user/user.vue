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
                @click="getUserList"
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
              <el-link
                class="global-table-world"
                style="font-size: 14px"
                type="primary"
                :underline="false"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          />
          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="description" label="描述" />

          <el-table-column fixed="right" label="操作" width="160px">
            <template #default="scope">
              <el-button
                text
                size="small"
                style="margin-right: -24px; margin-left: -10px; color: #006eff"
                @click="handleDialogValue(scope.row)"
              >
                更新
              </el-button>
              <el-button
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
                      @click="handlePwdDialog(scope.row)"
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
    width="560px"
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
      label-width="80px"
      :model="data.userForm"
      style="max-width: 90%"
    >
      <el-form-item required prop="name">
        <template #label>
          <span style="font-size: 13px; color: #191919">用户名称</span>
        </template>
        <el-input v-model="data.userForm.name" />
      </el-form-item>

      <el-form-item required prop="password">
        <template #label>
          <span style="font-size: 13px; color: #191919">密码</span>
        </template>
        <el-input v-model="data.userForm.password" type="password" show-password />
      </el-form-item>

      <el-form-item required prop="confirmPassword">
        <template #label>
          <span style="font-size: 13px; color: #191919">密码确认</span>
        </template>
        <el-input v-model="data.userForm.confirmPassword" type="password" show-password />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">状态</span>
        </template>

        <el-radio-group v-model="data.userForm.status">
          <el-radio style="margin-right: 16px" :value="0">标准</el-radio>
          <el-radio style="margin-right: 16px" :value="1">只读</el-radio>
          <el-radio :value="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="email">
        <template #label>
          <span style="font-size: 13px; color: #191919">邮箱</span>
        </template>
        <el-input v-model="data.userForm.email" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">描述</span>
        </template>
        <el-input v-model="data.userForm.description" type="textarea" :autosize="data.autosize" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px"></div>
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

  <el-dialog
    :model-value="data.passwordData.close"
    style="color: #000000; font: 14px"
    width="500px"
    center
    @close="closePwdDialog"
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
        修改密码
      </div>
    </template>

    <el-form
      ref="passwordDataRef"
      :rules="changePasswordRules"
      :model="data.passwordData.newObject"
      label-width="80px"
      style="max-width: 90%"
    >
      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">用户名称</span>
        </template>
        <el-input v-model="data.passwordData.object.name" disabled />
      </el-form-item>
      <el-form-item required prop="old">
        <template #label>
          <span style="font-size: 13px; color: #191919">旧密码</span>
        </template>
        <el-input
          v-model="data.passwordData.newObject.old"
          show-password
          placeholder="请输入旧密码"
        />
      </el-form-item>
      <el-form-item required prop="new">
        <template #label>
          <span style="font-size: 13px; color: #191919">新密码</span>
        </template>
        <el-input
          v-model="data.passwordData.newObject.new"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item required prop="new2">
        <template #label>
          <span style="font-size: 13px; color: #191919" show-password>密码确认</span>
        </template>
        <el-input
          v-model="data.passwordData.newObject.new2"
          show-password
          placeholder="再次输入新密码"
        />
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closePwdDialog">取消</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmPwdDialog"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatterTime } from '@/utils/formatter';
import UserEdit from './userEdit.vue';
import UserSetRole from './userSetRole.vue';
import Pagination from '@/components/pagination/index.vue';
import { GetUserList, deleteUser, createUser, updatePassword } from '@/services/user/userService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const loading = ref(false);
const userFormRef = ref();
const passwordDataRef = ref();
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
    minRows: 6,
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
    status: '0',
    confirmPassword: '',
  },

  // 修改密码属性
  passwordData: {
    close: false,
    object: '',
    newObject: {
      resource_version: 0,
      old: '',
      new: '',
      new2: '',
    },
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

const validatePassOld = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};

const validatePassOldNew = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else {
    if (data.passwordData.newObject.new === data.passwordData.newObject.old) {
      callback(new Error('新密码不可与旧密码一致'));
    }
    callback();
  }
};

const validatePassOldNew2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else {
    if (data.passwordData.newObject.new !== data.passwordData.newObject.new2) {
      callback(new Error('两次密码不匹配'));
    }
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
  } else {
    callback();
  }
};

const userFormRules = reactive({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20位之间', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
});

const changePasswordRules = reactive({
  old: [
    { required: true, validator: validatePassOld, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20位之间', trigger: 'blur' },
  ],
  new: [
    { required: true, validator: validatePassOldNew, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20位之间', trigger: 'blur' },
  ],
  new2: [
    { required: true, validator: validatePassOldNew2, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20位之间', trigger: 'blur' },
  ],
});

// 分页
const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  getUserList();
};

// 删除 开始
const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.id;
};

const confirm = async () => {
  const [result, err] = await deleteUser(data.deleteDialog.deleteName);
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  proxy.$notify.success(`User(${data.deleteDialog.deleteName}) 删除成功`);

  getUserList();
  cancel();
};

const cancel = () => {
  data.deleteDialog.close = false;
  // 延迟 1 秒重置数据，否则页面上会显的很怪
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};
// 删除 结束

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
      status: '0',
      confirmPassword: '',
    };
  }, 100);
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
      getUserList();
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

// 开始修改用户密码
const handlePwdDialog = (row) => {
  data.passwordData.close = true;
  data.passwordData.object = row;
  data.passwordData.newObject.resource_version = row.resource_version;
};

const closePwdDialog = () => {
  data.passwordData.close = false;
  setTimeout(() => {
    data.passwordData = {
      close: false,
      object: '',
      newObject: {
        resource_version: 0,
        old: '',
        new: '',
        new2: '',
      },
    };
  }, 100);
};

const confirmPwdDialog = async (row) => {
  passwordDataRef.value.validate(async (valid) => {
    if (valid) {
      const [result, err] = await updatePassword(
        data.passwordData.object.id,
        data.passwordData.newObject,
      );
      if (err) {
        proxy.$notify.error({ message: err });
        return;
      }
      proxy.$notify.success({ message: `用户(${data.passwordData.object.name})密码修改成功` });
      closePwdDialog();
    }
  });
};
// 结束修改用户密码
</script>

<style></style>
