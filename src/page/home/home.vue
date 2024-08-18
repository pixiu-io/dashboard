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
        <el-card style="width: 100%; height: 100vh; border-radius: 0px; overflow-y: auto">
          <h4 style="margin-bottom: 20px">操作记录</h4>
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(item, index) in clusterOption.audits"
              :key="index"
              :type="item.status === 0 ? 'danger' : 'primary'"
              :timestamp="formatTimestamp(item.gmt_create)"
              placement="top"
              hollow
            >
              <div>
                <p>
                  {{ item.operator }}
                  {{ op(item.action) }}
                  {{ item.resource_type }}
                </p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card></el-col
      >
    </el-row>
  </el-main>
</template>

<script setup>
import { reactive } from 'vue';
import MyEcharts from '@/components/echarts/index.vue';
import { getAuditList } from '@/services/audit/auditService';
import { formatTimestamp } from '@/utils/utils';

const clusterOption = reactive({
  audits: [],
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
const listAudits = async () => {
  const [result, err] = await getAuditList();
  if (err) {
    proxy.$notify.error({ title: 'Deployment', message: err.response.data.message });
    return;
  }
  clusterOption.audits = result;
};
onMounted(async () => {
  await listAudits();
});

const op = (method) => {
  switch (method) {
    case 'POST':
      return '新增';
    case 'PUT':
      return '更新';
    case 'PATCH':
      return '修改';
    case 'DELETE':
      return '删除';
  }
};
</script>

<style></style>
