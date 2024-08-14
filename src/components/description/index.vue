<template>
  <el-card :class="['description', className]">
    <el-space :alignment="alignment">
      <PixiuIcon :name="iconName" :color="iconColor" :size="'18px'" />
      {{ description }}
    </el-space>
  </el-card>
</template>

<script setup>
import PixiuIcon from '@/components/pixiuIcon/index.vue';
defineProps({
  iconName: {
    type: String,
    default: 'WarningFilled',
  },
  iconColor: {
    type: String,
    default: 'inherit',
  },
  description: {
    type: String,
    default: '',
    require: true,
  },
  alignment: {
    type: String,
    default: 'center',
  },
  className: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.description {
  font-size: 12px;
  line-height: inherit;
  color: #002da0;
  padding: 0;
  border-radius: 0;
  margin-bottom: 20px;
  background: #d5e7ff;
}
</style>
