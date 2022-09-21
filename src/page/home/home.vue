<template>
  <el-main id="main">
    <div style="height: 400px; width: 400px">
      <my-echarts :option="option1"></my-echarts>
    </div>
    <div style="height: 400px; width: 400px">
      <my-echarts :option="option2"></my-echarts></div
  ></el-main>
</template>

<script setup>
import { reactive } from "vue";
import MyEcharts from "@/components/echarts/index.vue";
const option1 = reactive({
  title: { text: "总用户量" },
  tooltip: {},
  xAxis: {
    data: ["12-3", "12-4", "12-5", "12-6", "12-7", "12-8"],
  },
  yAxis: {},
  series: [
    {
      name: "用户量",
      type: "line",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
});
const option2 = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "40",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
});
</script>

<style scoped></style>
