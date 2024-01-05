<template>
  <div class="header"></div>
  <div class="login-page">
    <div class="login-container">
      <div class="txt-container">Pixiu</div>
      <div class="tab-container">
        <div class="tab-item">
          <div selected="selected" class="u-tabs_item_3_DeFFee">
            {{ $t(`login.user_login`) }}
          </div>
        </div>
        <el-form
          :ref="(el) => (loginStore.loginFormRef = el)"
          :model="loginStore.loginInfo"
          style="width: 100%; height: 30%"
        >
          <el-form-item prop="name" class="inputDeep">
            <el-input
              v-model="loginStore.loginInfo.name"
              class="el-input"
              :placeholder="$t(`login.username`)"
              clearable
              maxlength="128"
              size="large"
              :border="false"
              @keyup.enter="loginStore.loginFn"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="inputDeep">
            <el-input
              v-model="loginStore.loginInfo.password"
              :placeholder="$t(`login.password`)"
              show-password
              clearable
              maxlength="128"
              size="large"
              @keyup.enter="loginStore.loginFn"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div style="display: grid; grid-template-columns: 1fr 1fr">
          <div>
            <el-checkbox class="checkbox" label="记住我" size="large" />
          </div>
          <div class="forget-container">
            <el-button class="forget-button" type="text" size="large" @click="loginStore.forgetFn">
              {{ $t(`login.forget`) }}
            </el-button>
          </div>
        </div>
        <div class="button-group">
          <el-button
            class="login-button"
            size="large"
            :loading="loginStore.loading"
            @click="loginStore.loginFn"
          >
            {{ $t(`login.login`) }}</el-button
          >
        </div>
        <div>
          <el-link class="more" href="https://github.com/pixiu-io/dashboard" target="_blank">
            更多信息...
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useLoginStore from '@/stores/useLogin';
const loginStore = useLoginStore();
</script>

<style scoped>
/* 有用 */
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
}

.login-container {
  width: 500px;
  height: 380px;
  box-sizing: border-box;
  background: #fff;
  margin-left: 80px;
  margin-top: 230px;
  transition: box-shadow 0.2s;
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
  display: none;
  box-sizing: content-box;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  border: 1px solid #ece5e3;
  border-bottom: none;
  /* margin-bottom: -1px; */
}

/* 有用 */
.u-tabs_item_3_DeFFee[selected] {
  background: #fff;
  color: #508ae2;
  border-color: #e0e6ed;
  border-top: 2px solid #508ae2;
}

.button-group {
  width: 100%;
  height: 40%;
  margin-top: 80px;
}

.forget-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 30px;
}

.forget-button {
  font-size: 15px;
  color: #007cbb;
  margin-top: -23px;
  margin-left: 100px;
}

.checkbox {
  margin-top: 5px;
  color: #007cbb;
}

.login-button {
  width: 105%;
  height: 35px;
  background: #e7eaea;
  color: #ccc;
  font-size: 13px;
}

.inputDeep {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;
    .el-input__inner {
      cursor: default !important;
    }
    border-bottom: 1px solid grey;
  }
}

.el-input {
  width: 160%;
  height: 30px;
}
.header {
  width: 100%;
  height: 60px;
  background-color: rgb(0, 74, 112);
}

.txt-container {
  margin-top: 125px;
  height: 100px;
  font-size: 35px;
}

.more {
  margin-left: 335px;
  font-size: 13px;
  color: #007cbb;
}
</style>
