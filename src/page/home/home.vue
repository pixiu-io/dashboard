<template>
  <el-main id="main">
    <div style="font-weight: bold; font-size: 18px; vertical-align: middle">
      概览
    </div>
    <div>
    <div style="display: flex; margin-top: 20px; height: 100px;">
      <transition name="el-zoom-in-top">
        <div class="transition-box">820<br>集群总数</div>
      </transition>

      <transition name="el-zoom-in-center">
        <div class="transition-box">80<br>节点总数</div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="transition-box">67<br>流水线总数</div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="transition-box">660<br>服务总数</div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="transition-box">890<br>实例总数</div>
      </transition>
      <transition name="el-zoom-in-bottom">
        <div class="transition-box">9<br>告警总数</div>
      </transition>
    </div>
   </div>
    <el-row>
      <el-col>
        <div
          style="height: 450px;width: 45%;margin-left: 30px;margin-top: 50px;display:inline-block;">
          <my-echarts :option="cloudOption"></my-echarts>
        </div>
        <div style="height: 450px; width: 45%; margin-left: 30px;float: right;margin-top: 50px;display:inline-block;">
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
    text: "平台用户访问分析",
  },
  tooltip: {},
  legend: {
    data: ["访问量"],
  },
  xAxis: {
    data: ["2020/09/01", "2020/09/02", "2020/09/03", "2020/09/04", "2020/09/05", "2020/09/06"],
  },
  yAxis: {},
  series: [
    {
      name: "访问量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
});

const cloudOption = reactive({
  title: { text: "平台产品访问分析" },
  legend: {
    top: "bottom",
  },
  toolbox: {
    show: false,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: "产品使用分析",
      type: "pie",
      radius: [20, 140],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: "容器服务" },
        { value: 38, name: "DevOps" },
        { value: 32, name: "Paas" },
        { value: 30, name: "微服务" },
        { value: 28, name: "用户中心" },
        { value: 26, name: "低代码" }
      ],
    },
  ],
});


</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.transition-box {
    margin-bottom: 50px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 20px 20px;
    box-sizing: border-box;
    margin-right: 20px;
    font-size: 18px;

  }

</style>
