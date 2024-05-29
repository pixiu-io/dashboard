<template>
  <!-- header有两部分 -->
  <div style="display: flex; align-items: center">
    <!-- <img src="../../../static/huawei.logo.png" /> -->
    <span style="font-size: large; margin-left: 18px">Pixiu Cloud</span>

    <el-button link style="margin-left: 35px; background-color: rgb(40, 43, 51)">
      <el-icon style="vertical-align: middle; margin-right: 0px; font-size: large">
        <component :is="'HomeFilled'"></component>
      </el-icon>
      <span style="font-size: small; color: #a6a1a1">总览</span>
    </el-button>
    <span style="margin-left: 16px; font-size: medium">|</span>

    <span style="margin-left: 16px; font-size: small; color: #adb0bb">云产品</span>

    <!-- <el-menu
      :default-active="data.activeIndex"
      active-text-color="#ffd04b"
      class="el-menu-class"
      text-color="#ADB0BB"
      background-color="rgb(40, 43, 51)"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-sub-menu index="1">
        <template #title>
          <span style="font-size: small; color: #adb0bb; height: 51px;"> 云产品 </span>
        </template>
        <el-menu-item style="width: 900px; height: 500px" index="2-1"
          >TODO</el-menu-item
        >
      </el-sub-menu>
    </el-menu> -->
  </div>

  <div style="display: flex; align-items: center">
    <el-input v-model="headInput" class="header-input" placeholder="搜索产品、文档..." clearable>
      <template #suffix>
        <el-icon class="el-input__icon" style="cursor: pointer">
          <component :is="'search'" />
        </el-icon>
      </template>
    </el-input>

    <span
      style="font-size: large; margin-right: 20px; margin-top: 8px; cursor: pointer"
      @click="handleMessage"
    >
      <el-icon>
        <component :is="'Message'"></component>
      </el-icon>
    </span>

    <el-drawer v-model="data.showMessage" title="站内信" direction="rtl" size="20%">
      <div></div>
    </el-drawer>

    <a href="https://github.com/caoyingjunz/pixiu" target="_blank" class="header-bottom">Github</a>

    <el-dropdown>
      <span
        style="
          font-size: small;
          color: #adb0bb;
          margin-right: 30px;
          cursor: pointer;
          padding: 6px 0px;
        "
      >
        工具
        <el-icon>
          <component :is="'CaretBottom'"></component>
        </el-icon>
      </span>
      <template #dropdown>
        <div class="no-border-radius">
          <el-dropdown-menu>
            <el-dropdown-item>百宝箱</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </template>
    </el-dropdown>

    <el-dropdown class="no-border-radius">
      <span
        style="
          font-size: small;
          color: #adb0bb;
          margin-right: 30px;
          cursor: pointer;
          padding: 6px 0px;
        "
      >
        支持
        <el-icon>
          <component :is="'CaretBottom'"></component>
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>售后支持</el-dropdown-item>
          <el-dropdown-item>待办</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div style="vertical-align: middle; margin-top: 35px; margin-right: 28px; cursor: pointer">
      <el-dropdown class="no-border-radius">
        <span>
          <el-avatar :size="27" :src="data.circleUrl" />
        </span>

        <template #dropdown>
          <div style="margin-left: 20px; font-size: 18px; margin-top: 15px">
            {{ data.loginUser }}
          </div>
          <div style="margin-left: 20px; margin-top: 10px">账号ID: {{ data.userId }}</div>

          <el-dropdown-menu>
            <el-dropdown-item divided @click="goToUserInfo">
              <el-icon>
                <component :is="'UserFilled'"></component>
              </el-icon>
              账号信息
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon> <component :is="'HelpFilled'"></component> </el-icon>访问管理
            </el-dropdown-item>
            <el-dropdown-item divided disabled>
              <el-icon> <component :is="'Shop'"></component></el-icon>帮助设置偏好
              <el-radio-group v-model="data.radio" size="small" style="margin-left: 18px">
                <el-radio-button label="开启" />
                <el-radio-button label="关闭" />
              </el-radio-group>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { logoutMethod } from '@/services/loginService';

const { proxy } = getCurrentInstance();
const data = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  radio: '开启',
  activeIndex: 1,
  showMessage: false,

  loginUser: '',
  userId: '',
});

onMounted(() => {
  data.loginUser = localStorage.getItem('account');
  data.userId = localStorage.getItem('userId');
});

const headInput = ref('');

const handleMessage = () => {
  data.showMessage = true;
};
const logout = async () => {
  // 直接发送退出请求，忽略是否真的已退出
  await logoutMethod(data.userId);

  // 清除本地缓存的 token 和 account
  localStorage.clear();
  // 跳转到登陆页面
  proxy.$router.push('/login');
};

const goToUserInfo = () => {
  proxy.$router.push('/user');
};
</script>

<style>
.header-input {
  margin-right: 30px;
  width: 200px;
  transition: width 0.5s;
}
.header-input:hover {
  width: 350px;
}

.el-menu-class {
  height: 51px;
}

.header-bottom {
  font-size: small;
  margin-right: 25px;
  color: #adb0bb;
  padding: 6px 0px;
}

.el-popper {
  border-radius: 0 !important;
}

.el-popper .el-dropdown-menu {
  border-radius: 0 !important;
}
</style>
