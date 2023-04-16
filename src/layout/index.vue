<!-- 将布局相关内容单独抽离出来，拆分页面和布局 -->
<template>
  <el-container class="modules-header-cf-header-container">
    <el-header
      style="
        display: flex;
        background-color: rgb(40, 43, 51);
        align-items: stretch;
        justify-content: space-between;
        height: 50px;
        padding: 0px 10px;
        color: rgb(173, 176, 184);
        fill: rgb(173, 176, 184);
      "
    >
      <pixiu-header />
    </el-header>

    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside>
        <el-col style="height: 100%" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
          <el-menu
            active-text-color="#ffd04b"
            background-color="rgb(51, 55, 68)"
            border-right="none"
            :default-active="data.activeIndex"
            text-color="#fff"
            router
            class="el-menu-vertical-no-collapse"
            :collapse="data.isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <pixiu-menu :items="data.menus" />
            <el-menu-item class="expand-icon">
              <el-icon @click="toggleCollapse">
                <component :is="`${data.isCollapse ? 'Expand' : 'Fold'}`"></component>
              </el-icon>
              <template #title> <span style="margin-left: 20px">体验调研</span></template>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>

      <!-- 主体 -->
      <!-- <el-main> -->
      <router-view />
      <!-- </el-main> -->
    </el-container>
  </el-container>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PixiuHeader from '@/components/header/index.vue';
import PixiuMenu from '@/components/menu/index.vue';
// import usePermissions from '@/stores/usePermission';

// const useStore = usePermissions();

const router = useRouter();

const data = reactive({
  activeIndex: router.currentRoute.value.fullPath
    ? router.currentRoute.value.fullPath
    : localStorage.getItem('activeIndex') ?? '/index',
  headInput: '',

  inputWidth: '200px',

  isCollapse: true, // 真则为在边栏，假则不在边栏
  manualCollapse: false, // 手动控制侧边栏是否开启，默认为 false
  menus: [],
});

onMounted(() => {
  data.menus = [
    {
      name: '概览',
      url: '/index',
      icon: 'Menu',
      iconType: 'el',
    },
    {
      name: '容器服务',
      url: '/container',
      icon: 'icon-yunrongqi',
      iconType: 'iconfont',
    },
    {
      name: 'DevOps',
      url: '/cicd',
      icon: 'DataLine',
      iconType: 'el',
    },
    {
      name: '用户管理',
      url: '/user',
      icon: 'UserFilled',
      iconType: 'el',
    },
    {
      name: '角色管理',
      url: '/role',
      icon: 'Guide',
      iconType: 'el',
    },
    {
      name: '菜单管理',
      url: '/menu',
      icon: 'Grid',
      iconType: 'el',
    },
  ];
});

// 持久化权限
// useStore.getPermission();

// 点击之后进行手动切换
const toggleCollapse = () => {
  data.manualCollapse = !data.manualCollapse;
};

const handleOpen = (key, keyPath) => {};
const handleClose = (key, keyPath) => {};

const mouseEnter = () => {
  if (!data.manualCollapse) {
    data.isCollapse = false;
  }
};

const mouseLeave = () => {
  if (!data.manualCollapse) {
    data.isCollapse = true;
  }
};
</script>

<style scoped="scoped">
.modules-header-cf-header-container {
  height: 100%;
  width: 100%;
  font-weight: 400;
  font-style: normal;
  /* position: fixed; */
  min-width: 1120px;
  z-index: 1002;
  top: 0;
  left: 0;
  background-color: #ebe7e7;
}

.el-header {
  background: rgb(55, 61, 61);
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  color: #fff;
  font-size: 25px;
}

.el-header img {
  vertical-align: middle;
  /* 调整图片高度 */
  height: 80%;
  width: auto;
  margin: 5px;
}

.el-aside {
  height: 100%;
  width: auto !important; /**宽度自适应 */
}

.el-menu-vertical-no-collapse:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

.el-menu {
  border-right: none;
  height: 100%;
}

.expand-icon {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.el-main {
  background: #fff;
}
</style>
