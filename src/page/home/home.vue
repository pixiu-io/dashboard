<template>
  <el-main id="main">
    <div style="font-weight: bold; font-size: 18px; vertical-align: middle">
      概览
    </div>

    <el-row>
      <el-col>
        <div
          style="
            height: 600px;
            width: 600px;
            margin-left: 100px;
            margin-top: 100px;
          "
        >
          <my-echarts :option="cloudOption"></my-echarts>
        </div>

        <div style="height: 600px; width: 1000px; float: right">
          <my-echarts :option="option"></my-echarts>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup>
import { reactive } from "vue";
import MyEcharts from "@/components/echarts/index.vue";

const option = reactive({
  title: {
    text: "用户列表",
  },
  tooltip: {},
  legend: {
    data: ["销量"],
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
});

const cloudOption = reactive({
  title: { text: "容器" },
  legend: {
    top: "bottom",
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [50, 250],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: "rose 1" },
        { value: 38, name: "rose 2" },
        { value: 32, name: "rose 3" },
        { value: 30, name: "rose 4" },
        { value: 28, name: "rose 5" },
        { value: 26, name: "rose 6" },
        { value: 22, name: "rose 7" },
        { value: 18, name: "rose 8" },
      ],
    },
  ],
});
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
