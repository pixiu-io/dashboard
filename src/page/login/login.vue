<template>
  <div class="login-page">
    <div class="login-container">
      <div class="tab-container">
        <div class="tab-item">
          <div selected="selected" class="u-tabs_item_3_DeFFee">
            {{ $t(`login.user_login`) }}
          </div>
          <div class="change-language-container">
            <div style="cursor: pointer" @click="i18nStore.changeLanguage">
              <el-icon class="el-input__icon">
                <component :is="'Switch'" />
              </el-icon>
              {{ $t(`login.switch_language`) }}
            </div>
          </div>
        </div>
        <el-form
          :ref="(el) => (loginStore.loginFormRef = el)"
          :model="loginStore.loginInfo"
          :rules="rules"
          style="width: 100%; height: 30%"
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
        <div class="button-group">
          <div class="forget-container">
            <el-button class="forget-button" type="text" size="large" @click="loginStore.forgetFn">
              {{ $t(`login.forget`) }}
            </el-button>
          </div>
          <el-button
            class="login-button"
            size="large"
            :loading="loginStore.loading"
            @click="loginStore.loginFn"
          >
            {{ $t(`login.login`) }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useLoginStore from '@/stores/useLogin';
import useI18nStore from '@/stores/useI18n';
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const loginStore = useLoginStore();
const i18nStore = useI18nStore();
</script>

<style scoped>
/* 有用 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login-container {
  width: 450px;
  height: 380px;
  box-sizing: border-box;
  background: #fff;
  transition: box-shadow 0.2s;
  box-shadow: 0 0 10px 0 rgb(80 90 109 / 16%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-container {
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.tab-item {
  width: 100%;
  display: flex;
}

.u-tabs_item_3_DeFFee {
  cursor: pointer;
  display: inline-block;
  box-sizing: content-box;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border: 1px solid #ece5e3;
  border-bottom: none;
  /* margin-bottom: -1px; */
}

.change-language-container {
  width: 70%;
  border-bottom: 1px solid #ece5e3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #508ae2;
}

/* 有用 */
.u-tabs_item_3_DeFFee[selected] {
  background: #fff;
  color: #508ae2;
  border-color: #e0e6ed;
  border-top: 2px solid #508ae2;
}

.u-tabs_head_3_DeFFee {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 30px;
  border-bottom: 1px solid #ece5e3;
  width: 100%;
}

.button-group {
  width: 100%;
  height: 40%;
}

.forget-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.forget-button {
  font-size: inherit;
  color: #6383dc;
}

.login-button {
  width: 100%;
  background: #508ae2;
  color: #fff;
  font-size: 17px;
}

.el-form-item {
  width: 100%;
}
</style>
