<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 用户信息 </span>
    </el-card>

    <div style="margin-top: 38px; margin-left: 38px">
      <el-form label-width="80px" style="max-width: 600px">
        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">用户名称</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.name }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">创建时间</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.gmt_create }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">登录密码</span>
          </template>
          <div style="margin-left: 30px">***</div>
          <div
            style="margin-left: 6px; color: #006eff; font-size: 13px; cursor: pointer"
            @click="handlePwdDialog"
          >
            修改
          </div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">用户状态</span>
          </template>
          <div v-if="userForm.status === 0" style="font-size: 13px; margin-left: 30px">正常</div>
          <div v-else-if="userForm.status === 1" style="font-size: 13px; margin-left: 30px">
            只读
          </div>
          <div v-else style="font-size: 13px; margin-left: 30px">禁用</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">邮箱</span>
          </template>
          <div style="margin-left: 30px">{{ userForm.email }}</div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <span style="font-size: 13px; color: #191919">描述</span>
          </template>
          <el-input
            v-model="userForm.description"
            type="textarea"
            :autosize="data.autosize"
            style="margin-left: 30px"
          />
        </el-form-item>
      </el-form>
    </div>

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
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import { getUser, updatePassword } from '@/services/user/userService';

const { proxy } = getCurrentInstance();
const passwordDataRef = ref();
const data = reactive({
  autosize: {
    minRows: 6,
  },

  // 修改密码属性
  passwordData: {
    close: false,
    object: { name: '', id: '' },
    newObject: {
      resource_version: 0,
      old: '',
      new: '',
      new2: '',
    },
  },
});

const userForm = reactive({
  id: 0,
  description: '',
  gmt_create: '',
  email: '',
  name: '',
  role: 0,
  status: 0,
});

onMounted(() => {
  userForm.id = localStorage.getItem('userId');
  GetUser();
});

const GetUser = async () => {
  const [result, err] = await getUser(userForm.id);
  if (err) {
    proxy.$message.error(err);
    return;
  }

  userForm.name = result.name;
  userForm.description = result.description;
  userForm.gmt_create = formatTimestamp(result.gmt_create);
  userForm.email = result.email;
  userForm.role = result.role;
  userForm.status = result.status;

  data.passwordData.object.name = result.name;
  data.passwordData.object.id = result.id;
  data.passwordData.newObject.resource_version = result.resource_version;
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

// 开始修改用户密码
const handlePwdDialog = () => {
  data.passwordData.close = true;
};

const closePwdDialog = () => {
  data.passwordData.close = false;
  setTimeout(() => {
    data.passwordData = {
      close: false,
      object: { name: '', id: '' },
      newObject: {
        resource_version: 0,
        old: '',
        new: '',
        new2: '',
      },
    };
  }, 100);
};

const confirmPwdDialog = async () => {
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
</script>
