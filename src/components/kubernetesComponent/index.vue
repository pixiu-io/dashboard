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
        <el-checkbox-group v-model="data.selectCharts" class="checkbox">
          <el-space wrap :size="12">
            <el-card v-for="chart in data.categoryAppCharts" :key="chart.name" class="card">
              <template #header>
                <div class="card-header">
                  <el-checkbox :label="chart.name" :value="chart" />
                </div>
                {{ chart.version }}
              </template>
              <div class="card-body">
                <pixiu-icon
                  :name="`icon-${chart.name.toLowerCase()}`"
                  size="40px"
                  type="iconfont"
                />
                <p class="content">{{ chart.name }} 功能描述补充</p>
              </div>
              <template #footer>
                <el-button
                  type="text"
                  size="small"
                  :disabled="!chart.config"
                  @click="openDialog(chart)"
                  >参数配置</el-button
                >
                <el-button style="margin-left: -10px" type="text" size="small">查看详情</el-button>
              </template>
            </el-card>
          </el-space>
        </el-checkbox-group>
        <!-- <el-checkbox-group v-model="data.selectCharts" class="checkbox" @change="onSelect">
          <el-space wrap>
            <el-card v-for="chart in data.categoryAppCharts" :key="chart.Name" class="card">
              <template #header>
                <div class="card-header">
                  <el-checkbox :label="chart.Name" :value="chart" />
                </div>
                {{ chart.LatestVersion }}
              </template>

              <div v-if="chart.Name === 'Helm'" class="card-body">
                <pixiu-icon name="icon-Helm" size="40px" type="iconfont" />
                <p class="content">Helm 功能描述补充</p>
              </div>

              <div v-if="chart.Name === 'Haproxy'" class="card-body">
                <pixiu-icon name="icon-Haproxy" size="40px" type="iconfont" />
                <p class="content">HAproxy 功能描述补充</p>
              </div>

              <div v-if="chart.Name === 'NginxIngress'" class="card-body">
                <pixiu-icon name="icon-ubuntu" size="40px" type="iconfont" />
                <p class="content">NginxIngress 功能描述补充</p>
              </div>

              <div v-if="chart.Name === 'Prometheus'" class="card-body">
                <pixiu-icon name="icon-promethues" size="40px" type="iconfont" />
                <p class="content">Prometheus 功能描述补充</p>
              </div>

              <div v-if="chart.Name === 'Grafana'" class="card-body">
                <pixiu-icon name="icon-grafana" size="40px" type="iconfont" />
                <p class="content">Grafana 功能描述补充</p>
              </div>

              <template #footer>
                <el-button type="text" size="small" disabled>参数配置</el-button>
                <el-button style="margin-left: -10px" type="text" size="small">查看详情</el-button>
              </template>
            </el-card>
          </el-space>
        </el-checkbox-group> -->
      </div>
    </div>
  </el-form-item>
  <el-form-item label="已选择组件">
    <el-tag
      v-for="chart in data.selectCharts"
      :key="chart.name"
      class="tag-item"
      closable
      type="info"
      @close="removeChart(chart)"
    >
      {{ chart.name }}
    </el-tag>
  </el-form-item>

  <el-drawer
    v-model="data.dialog"
    :title="`${data.chart.name} 参数配置`"
    :before-close="handleClose"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form :model="data.chart.config" label-position="top">
        <div v-for="(value, key) in data.chart.config" :key="key">
          <el-form-item :label="key">
            <el-input v-model="data.chart.config[key]"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="flex: auto; text-align: center">
      <el-button class="pixiu-cancel-button" @click="handleClose">取消</el-button>
      <el-button class="pixiu-small-confirm-button" type="primary" @click="handleClose"
        >确认
      </el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import _ from 'lodash';
const data = reactive({
  dialog: false,
  loading: false,
  appCharts: '',
  category: '全部',
  categoryAppCharts: [],
  selectCharts: [],
  chart: {},
});

const openDialog = (chart) => {
  data.dialog = true;
  data.chart = chart;
};
const handleClose = () => {
  data.dialog = false;
};
// 根据chart数据分类，并将Label和Config转换为Object
const categorizeChartsByKind = (charts) => {
  return charts.reduce((acc, chart) => {
    if (chart.label) {
      chart.label = JSON.parse(chart.label);
    }
    if (chart.config) {
      chart.config = JSON.parse(chart.config);
    }
    const kind = chart.label.kind;
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
const getComponents = () => {
  let tmpCharts = {};
  data.selectCharts.forEach((chart) => {
    tmpCharts[chart.name.toLowerCase()] = _.cloneDeep(chart);
    delete tmpCharts[chart.name.toLowerCase()].name;
  });
  return tmpCharts;
};

const removeChart = (chart) => {
  data.selectCharts.splice(data.selectCharts.indexOf(chart), 1);
};
onMounted(() => {
  if (props.appCharts) {
    data.appCharts = categorizeChartsByKind(props.appCharts);
    data.categoryAppCharts = data.appCharts['全部'];
  }
});

const props = defineProps({
  appCharts: {
    type: Array,
    default: null,
  },
});

defineExpose({
  getComponents,
});
</script>
<style scoped>
.el-card :deep(.el-card__header) {
  background-color: #f5f5f5;
  padding: 5px 18px;
}

.el-card :deep(.el-card__footer) {
  padding: 5px 7px;
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
}
.content {
  margin-left: 18px;
}
.form-content {
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
