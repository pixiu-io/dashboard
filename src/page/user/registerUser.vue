<template>
  <el-card class="login-page-header">
    <el-row>
      <el-col>
        <div style="color: black; margin-left: 8px; font-size: 18px; margin-top: -8px">
          Pixiu Cloud
        </div>
        <div
          style="color: black; font-size: 14px; margin-right: 90px; margin-top: -20px; float: right"
        >
          简体中文
        </div>
        <div
          style="color: black; font-size: 14px; margin-right: 20px; margin-top: -20px; float: right"
        >
          关于我们
        </div>
      </el-col></el-row
    >
  </el-card>

  <el-main>
    <div class="app-pixiu-content-card">
      <el-form
        ref="ruleFormRef"
        label-position="left"
        require-asterisk-position="right"
        label-width="100px"
        :rules="rules"
        status-icon
        :model="data.userForm"
      >
        <el-form-item prop="name">
          <el-input v-model="data.userForm.name" style="width: 300px" placeholder="用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="data.userForm.password" style="width: 300px" placeholder="密码" />
        </el-form-item>

        <div style="margin-top: 30px" />
        <el-form-item>
          <el-button
            class="pixiu-confirm-button"
            style="width: 300px"
            type="primary"
            @click="confirmRegister()"
            >立即注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getCurrentInstance, reactive, ref, onMounted } from 'vue';
import { createUser } from '@/services/user/userService';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const router = useRouter();

const data = reactive({
  userForm: {
    name: '',
    password: '',
    status: 2,
    confirmPassword: '',
  },
});

const rules = {
  name: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
  password: [{ required: true, message: '密码为必填项', trigger: 'blur' }],
};

const confirmRegister = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('data', data.userForm);
      const [result, err] = await createUser(data.userForm, true);
      if (err) {
        proxy.$notify.error({
          message: err,
        });
        return;
      }
      proxy.$notify.success({
        message: '用户初始化成功',
      });
      router.push({ path: '/login' });
    }
  });
};
</script>
<style>
.login-page-header {
  width: 100%;
  height: 52px;
  border-radius: 0px;
  border: none;
}
</style>
