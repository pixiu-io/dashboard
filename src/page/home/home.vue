<template>
  <el-main style="background-color: #f3f4f7">
    <el-row :gutter="15" style="height: 100%">
      <el-col :span="18">
        <el-row style="height: 48%">
          <el-card
            style="border-radius: 0px; width: 100%; height: 100%"
            body-style="width: calc(100% - 40px); height: calc(100% - 40px);
            display:flex;align-items:center;justify-content:space-between"
          >
            <my-echarts :option="clusterOption" style="height: 100%"></my-echarts>
            <my-echarts :option="planOption" style="height: 100%"></my-echarts>
            <my-echarts :option="userOption" style="height: 100%"></my-echarts>
          </el-card>
        </el-row>

        <el-row style="height: 2%"></el-row>

        <el-row style="height: 50%">
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

const clusterOption = reactive({
  title: { text: '运行情况' },
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
      name: '集群运行分析',
      type: 'pie',
      radius: ['0', '55%'],
      data: [
        { value: 40, name: '部署中' },
        { value: 38, name: '运行中' },
        { value: 32, name: '未开始' },
        { value: 10, name: '部署失败' },
      ],
    },
  ],
});
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
      radius: ['0', '55%'],
      data: [
        { value: 40, name: '已完成' },
        { value: 40, name: '进行中' },
        { value: 20, name: '部署失败' },
      ],
    },
  ],
});
const userOption = reactive({
  title: { text: '用户情况' },
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
      name: '用户使用情况分析',
      type: 'pie',
      radius: ['0', '55%'],
      data: [
        { value: 60, name: '标准用户' },
        { value: 40, name: '只读用户' },
        { value: 20, name: '禁用用户', itemStyle: { color: '#ccc' } },
      ],
    },
  ],
});
</script>

<style></style>
