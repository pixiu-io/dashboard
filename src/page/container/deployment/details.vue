<template>
  <el-card class="title-card-container">
    <div class="font-container">deployment 详情</div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PixiuTag from '@/components/pixiuTag/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  loading: false,
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
});
</script>

<style scoped="scoped"></style>
