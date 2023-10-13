<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-box">
        <p class="login-title">多云管理平台</p>
        <p class="login-sub-title">登 录</p>

        <el-form
          :ref="(el) => (loginStore.loginFormRef = el)"
          :model="loginStore.loginInfo"
          :rules="rules"
          style="width: 100%; height: 25%"
        >
          <el-form-item prop="name">
            <el-input
              v-model="loginStore.loginInfo.name"
              :placeholder="$t(`login.username`)"
              clearable
              maxlength="128"
              size="large"
              @keyup.enter="loginStore.loginFn"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <component :is="'UserFilled'" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginStore.loginInfo.password"
              :placeholder="$t(`login.password`)"
              show-password
              clearable
              maxlength="128"
              size="large"
              @keyup.enter="loginStore.loginFn"
            >
              <template #prefix>
                <el-icon class="el-input__icon">
                  <component :is="'Lock'"></component>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          style="width: 100%"
          size="large"
          type="primary"
          :loading="loginStore.loading"
          @click="loginStore.loginFn"
        >
          {{ $t(`login.login`) }}</el-button
        >

        <div class="link">
          <el-button type="text" size="small" @click="loginStore.forgetFn">
            {{ $t(`login.forget`) }}
          </el-button>
        </div>
      </div>
      <div class="login-background"></div>
    </div>
  </div>
</template>

<script setup>
import useLoginStore from '@/stores/useLogin';
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const loginStore = useLoginStore();
</script>

<style scoped>
@keyframes login-box {
  0% {
    left: -400px;
  }

  50% {
    left: -400px;
  }

  100% {
    left: 0;
  }
}

@keyframes background {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: aliceblue;
  width: 100%;
  height: 100%;
}

.login-container {
  display: flex;
  width: 1000px;
  height: 600px;
  box-shadow: 4px 4px 8px rgb(159, 159, 159, 0.7);
  background-color: white;
  overflow: hidden;
  border-radius: 10px;
}

.login-container .login-form-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(400px - 60px);
  height: calc(100% - 128px);
  background-color: white;
  padding: 64px;
  animation: login-box 2s;
}

.login-container .login-form-box .login-title {
  display: flex;
  justify-content: center;
  margin: 0 0 40px 0;
  font-size: 32px;
}

.login-container .login-form-box .login-sub-title {
  display: flex;
  justify-content: center;
  margin: 0 0 16px 0;
  font-size: 18px;
}

.login-container .login-form-box .link {
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 10px;
}

.login-container .login-background {
  display: flex;
  width: 100%;
  height: 100%;
  animation: background 2s;
  background: #f6f6f6 url('@/assets/images/whale.jpg') no-repeat center;
}
</style>
