<template>
  <el-card class="login-page-header">
    <el-row>
      <el-col>
        <div style="color: #e0e6ed; margin-left: 8px; font-size: 18px; margin-top: -8px">
          Pixiu Cloud
        </div>
        <div
          style="
            color: #e0e6ed;
            font-size: 14px;
            margin-right: 90px;
            margin-top: -20px;
            float: right;
          "
        >
          简体中文
        </div>
        <div
          style="
            color: #e0e6ed;
            font-size: 14px;
            margin-right: 20px;
            margin-top: -20px;
            float: right;
          "
        >
          关于我们
        </div>
      </el-col></el-row
    >
  </el-card>
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
        <div class="remember-and-forget">
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
            :class="{ 'button-active': isButtonActive }"
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
    <div class="right-background"></div>
  </div>
</template>

<script setup>
import useLoginStore from '@/stores/useLogin';
import { computed } from 'vue';
const loginStore = useLoginStore();

const isButtonActive = computed(() => {
  return loginStore.loginInfo.name && loginStore.loginInfo.password;
});
</script>

<style scoped>
/* 有用 */
.login-page {
  display: grid;
  grid-template-columns: 35% 65%;
  width: 100%;
  align-items: center;
  height: 100%;
}

.right-background {
  height: 100%;
  background-size: cover;
  background-image: url('data:image/svg+xml;charset=utf8,%3C%3Fxml version%3D"1.0" encoding%3D"UTF-8" standalone%3D"no"%3F%3E%3Csvg width%3D"736px" height%3D"838px" viewBox%3D"0 0 736 838" version%3D"1.1" xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" xmlns%3Axlink%3D"http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink"%3E%3Ctitle%3Evector art%3C%2Ftitle%3E%3Cdesc%3ECreated with Sketch.%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg id%3D"symbols" stroke%3D"none" stroke-width%3D"1" fill%3D"none" fill-rule%3D"evenodd"%3E%3Cg id%3D"Login" transform%3D"translate(-504.000000%2C 0.000000)"%3E%3Cg id%3D"replaceable-image" transform%3D"translate(504.000000%2C 0.000000)"%3E%3Cg id%3D"vector-art" transform%3D"translate(-78.000000%2C -82.000000)"%3E%3Crect id%3D"Rectangle-path" fill%3D"%2322343E" x%3D"0" y%3D"0.38" width%3D"1127.55" height%3D"921.62"%3E%3C%2Frect%3E%3Cpolygon id%3D"Shape" fill%3D"%232F657B" points%3D"0 3.06 0 599.24 298.14 301.43"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%23438597" points%3D"0 408.65 0 599.24 95.29 504.06"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%232F657B" points%3D"918.21 921.95 818.63 822.3 718.89 921.95"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%233B758E" points%3D"818.63 822.3 298.14 301.43 0 599.24 0 655.02 266.51 921.95 718.89 921.95"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%23579EB2" points%3D"512.67 921.95 95.29 504.06 0 599.24 0 654.97 267.06 921.95"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%23344B57" points%3D"266.51 921.95 0 655.02 0 921.95"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%23A7C9D5" points%3D"1128 0 799.58 0 1128 329.83"%3E%3C%2Fpolygon%3E%3Cpolygon id%3D"Shape" fill%3D"%23344B57" points%3D"1128 329.83 799.58 0 599.9 0 298.14 301.43 818.63 822.3 1128 513.18"%3E%3C%2Fpolygon%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
}

.login-container {
  box-sizing: border-box;
  background: #fff;
  margin-top: 50px;
  margin-left: 80px;
  transition: box-shadow 0.2s;
}

.tab-container {
  height: 80%;
  width: 80%;
  display: flex;
  position: relative;
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
  border: 1px solid #006eff;
  border-bottom: none;
  /* margin-bottom: -1px; */
}

/* 有用 */
.u-tabs_item_3_DeFFee[selected] {
  background: #fff;
  color: #006eff;
  border-color: #e0e6ed;
  border-top: 2px solid #006eff;
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
  font-size: 14px;
  color: #006eff;
  margin-top: -24px;
  margin-right: -30px;
  margin-left: 160px;
}

.checkbox {
  margin-top: 5px;
  color: #006eff;
}

.login-button {
  width: 100%;
  margin-top: -50px;
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
.login-page-header {
  width: 100%;
  height: 55px;
  border-radius: 0px;
  margin-top: -1px;
  margin-bottom: -1px;
  margin-left: -1px;
  margin-right: -1px;
  background-color: rgb(0, 74, 112);
}

.txt-container {
  height: 100px;
  font-size: 35px;
}

.remember-and-forget {
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: absolute;
  right: 10px;
  top: 80px;
}

.more {
  position: absolute;
  bottom: -15px;
  right: -5px;
  color: #006eff;
  font-size: 13px;
}

.button-active {
  background-color: #006eff;
}
</style>
