<template>
  <div
    :style="`
      width: 100%;
      height: ${height};
      background: #ffffff;
      display: flex;
      align-items: center;
    `"
  >
    <div class="app-pixiu-header-title">
      <el-space>
        <div v-if="back" class="back-button" @click="goBack">
          <el-icon>
            <component :is="'Back'"></component>
          </el-icon>
        </div>
        <span>{{ title }}</span>
      </el-space>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  title: {
    type: String,
    default: '默认标题',
  },
  height: {
    type: String,
    default: '60px',
  },
  back: {
    type: Boolean,
    default: false,
  },
});

const goBack = () => {
  router.back();
};

defineExpose({
  goBack,
});
</script>

<style scoped>
.app-pixiu-header-title {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  font-weight: 700;
  padding-left: 20px;
}
.back-button {
  cursor: pointer;
  font-size: 17px;
  font-weight: 700;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-button:active {
  background-color: rgba(1, 1, 1, 0.1);
}
</style>
