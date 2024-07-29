<template>
  <el-card class="app-docs" style="padding: 0">
    <el-space>
      <PixiuIcon :name="iconName" :color="iconColor" :size="'18px'" />
      {{ description }}
    </el-space>
  </el-card>
</template>

<script setup>
import PixiuIcon from '@/components/pixiuIcon/index.vue';
const props = defineProps({
  description: {
    type: String,
    default: '',
    required: true,
  },
  iconColor: {
    type: String,
    default: 'inherit',
  },
  iconName: {
    type: String,
    default: 'WarningFilled',
  },
});
</script>
