<template>
  <el-form-item label="组件选择">
    <div>
      <el-radio-group v-model="data.category" @change="onChange">
        <el-radio-button
          v-for="(value, key) in data.appCharts"
          :key="key"
          :label="key"
          :value="key"
          border
        />
      </el-radio-group>

      <div class="form-content">
        <el-checkbox-group v-model="data.selectCharts" class="checkbox" @change="onSelect">
          <el-space wrap>
            <el-card v-for="chart in data.categoryAppCharts" :key="chart.Name" class="card">
              <template #header>
                <div class="card-header">
                  <el-checkbox :label="chart.Name" :value="chart" />
                </div>
                {{ chart.LatestVersion }}
              </template>
              <div class="card-body">
                <div><pixiu-icon name="icon-ubuntu" size="40px" type="iconfont" /></div>
                <p class="content">
                  qGPU是腾讯云推出的GPU共享技术，支持在多个容器间共享GPU卡并提供容器间显存和算力的强隔离，该特性仅支持原生节点。qGPU是腾讯云推出的GPU共享技术，支持在多个容器间共享GPU卡并提供容器间显存和算力的强隔离，该特性仅支持原生节点
                </p>
              </div>
              <template #footer>
                <el-button type="text" size="small" disabled>参数配置</el-button>
                <el-button type="text" size="small">查看详情</el-button>
              </template>
            </el-card>
          </el-space>
        </el-checkbox-group>
      </div>
    </div>
  </el-form-item>
  <el-form-item label="已选择组建">
    <el-tag
      v-for="chart in data.selectCharts"
      :key="chart.Name"
      class="tag-item"
      closable
      type="info"
      @close="removeChart(chart)"
    >
      {{ chart.Name }}
    </el-tag>
  </el-form-item>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

const data = reactive({
  appCharts: '',
  category: '',
  categoryAppCharts: [],
  selectCharts: [],
});
// 根据chart数据分类
const categorizeChartsByKind = (charts) => {
  return charts.reduce((acc, chart) => {
    const kind = JSON.parse(chart.Label).kind;
    if (!acc[kind]) {
      acc[kind] = [];
    }
    acc[kind].push(chart);
    return acc;
  }, {});
};

const onChange = () => {
  data.categoryAppCharts = data.appCharts[data.category];
};
const onSelect = () => {
  console.log(data.selectCharts);
};
const removeChart = (chart) => {
  data.selectCharts.splice(data.selectCharts.indexOf(chart), 1);
};
onMounted(() => {
  if (props.appCharts) {
    data.appCharts = categorizeChartsByKind(props.appCharts);
  }
});

const props = defineProps({
  appCharts: {
    type: Array,
    default: null,
  },
});
</script>
<style scoped>
.card {
  min-width: 453px;
  max-width: 453px;
  height: 218px;
}
.el-card ::v-deep .el-card__header {
  background-color: #f5f5f5;
  padding: 5px 18px;
}

.el-card ::v-deep .el-card__footer {
  padding: 5px 7px;
}
.el-card ::v-deep .el-card__body {
  padding: 0;
}
.card-body {
  max-height: 90px;
  overflow-y: auto;
  word-break: break-all;
  font-size: 14px;
  line-height: normal;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 20px;
}
.content {
  margin-left: 18px;
}
.form-content {
  width: 90%;
  margin-top: 20px;
  padding: 20px;
  max-height: 500px;
  overflow: auto;
  /* 边框 */
  border: 1px solid #c0c0c0;
}

.tag-item {
  margin-right: 10px;
}
</style>
