<template>
  <div>kubernetes</div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  cloud: {}
});

onMounted(() => {
  data.cloud = proxy.$route.params
  console.log(data.cloud)
});
</script>
