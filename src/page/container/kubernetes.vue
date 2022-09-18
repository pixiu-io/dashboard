<template>
  <div>kubernetes</div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  cloudId: "",
});

onMounted(() => {
  data.cloudId = proxy.$route.params.cloudId
  console.log(data.cloudId)
});
</script>
