<template>
  <div>services</div>
</template>

<script setup>
const data = reactive({});

onMounted(() => {
  data.cloud = proxy.$route.params;
});
</script>

<style scoped="scoped"></style>
