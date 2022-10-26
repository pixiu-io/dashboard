<template>
  <div ref="chartDom" class="echart"></div>
</template>

<script setup>
// 独立封装echarts的使用，根据传递进来的option生成不同的图表
// 按需导入需要用到的 vue函数 和echarts
import { ref, inject, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import elementResizeDetectorMaker from 'element-resize-detector';

const echarts = inject('echarts');
// 获取 dom 和 父组件数据 并定义"myChart"用于初始化图表
const chartDom = ref();
let myChart = null;
const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
});

// 页面成功渲染，开始绘制图表
onMounted(() => {
  myChart = echarts.init(chartDom.value);
  myChart.setOption(props.option, true);
  const erd = elementResizeDetectorMaker();
  erd.listenTo(chartDom.value.parentNode, (element) => {
    nextTick(() => {
      myChart.resize(); // 上层容器变化触发图标重载
    });
  });
});

// 页面销毁前，销毁事件和实例
onBeforeUnmount(() => {
  // chartDom.value.parentNode.removeEventListener("resize", cancalDebounce);
  myChart.dispose();
});
// 监听图表数据时候变化，重新渲染图表
watch(
  () => props.option,
  () => {
    myChart.setOption(props.option, true);
  },
  { deep: true },
);
</script>

<style scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>
