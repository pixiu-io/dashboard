<template>
  <el-card class="app-docs" :style="cardStyle">
    <el-icon :style="iconStyle">
      <WarningFilled />
    </el-icon>
    <div :style="textStyle">
      {{ description }}
    </div>
  </el-card>
</template>

<script setup>
import { WarningFilled } from '@element-plus/icons-vue';
const props = defineProps({
  description: {
    type: String,
    default: 'null',
    required: true,
  },
  cardStyle: {
    type: Object,
    default: () => ({
      height: '40px',
      marginTop: '5px',
    }),
  },
  iconStyle: {
    type: Object,
    default: () => ({
      verticalAlign: 'middle',
      fontSize: '16px',
      marginLeft: '-25px',
      marginTop: '-50px',
    }),
  },
  textStyle: {
    type: Object,
    default: () => ({
      verticalAlign: 'middle',
      marginTop: '-40px',
    }),
  },
});
</script>
