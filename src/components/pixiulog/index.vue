<template>
  <el-card class="contend-card-container2" style="margin-left: 8px">
    <div style="background-color: #29232b; color: white; min-height: 440px">
      <div style="margin-left: 20px">
        <MyMonaco :yaml="data.log" :height="data.dialogHeight" :read-only="readOnly"></MyMonaco>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import MyMonaco from '@/components/monaco/index.vue';
import { reactive, getCurrentInstance, onMounted, ref, watch, toRaw } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  cluster: '',
  log: '',
  fromSize: 'small',
  //   dialogWidth: 300,
  dialogHeight: 400,
});

const props = defineProps({
  cluster: {
    type: String,
    default: '',
  },
  log: {
    type: String,
    default: '',
  },
  readOnly: {
    type: Boolean,
    default: true,
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
});

watch(() => {
  data.log = props.log.valueOf();
});
</script>

<style></style>
