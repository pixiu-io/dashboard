<template>
  <el-main style="background-color: #f3f4f7">
    <el-row :gutter="15" style="height: 100%">
      <el-col :span="18">
        <el-row style="height: 58%">
          <el-card style="width: 100%; height: 100%; border-radius: 0px">
            <div style="width: 45%; margin-left: 1px; margin-top: 1px; display: inline-block">
              <my-echarts :option="planOption"></my-echarts>
            </div>
          </el-card>
        </el-row>

        <el-row style="height: 2%"></el-row>

        <el-row style="height: 40%">
          <el-card style="width: 100%; height: 100%; border-radius: 0px">监控大盘</el-card></el-row
        >
      </el-col>

      <el-col :span="6">
        <el-card style="width: 100%; height: 100%; border-radius: 0px">操作记录</el-card></el-col
      >
    </el-row>
  </el-main>
</template>

<script setup>
import { reactive } from 'vue';
import MyEcharts from '@/components/echarts/index.vue';

const planOption = reactive({
  title: { text: '部署计划' },
  legend: {
    top: 'bottom',
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
      name: '产品使用分析',
      type: 'pie',
      radius: [20, 140],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: '部署中' },
        { value: 38, name: '运行中' },
        { value: 32, name: '未开始' },
        { value: 10, name: '部署失败' },
      ],
    },
  ],
});
</script>

<style></style>
