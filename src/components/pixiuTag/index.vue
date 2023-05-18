<template>
  <div class="wrap">
    <div class="wrap-cont">
      <div class="wrap-cont-p">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: '内容',
  },
  num: {
    type: Number,
    default: 1,
  },
});
</script>

<style scoped>
.wrap {
  display: flex;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  max-height: 100px;
  color: #409eff;
  padding: 0 10px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
}
.wrap-cont {
  overflow: hidden;
  flex: 1;
  width: 0;
}
.wrap-cont-p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 23px;
}
</style>
