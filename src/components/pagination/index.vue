<template>
  <div class="root">
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="page.page"
      v-model:page-size="page.limit"
      style="float: right; margin-right: 40px; margin-top: 20px; margin-bottom: 20px"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="onChange"
      @current-change="onChange"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({ total: { type: Number, default: 0 } });
const page = reactive({
  page: 1,
  limit: 10,
});
const emit = defineEmits(['onChange']);
const onChange = () => {
  emit('onChange', page);
};
</script>

<style scoped></style>
