<template>
  <div style="display: flex">
    <pixiu-icon
      name="icon-back"
      style="cursor: pointer"
      size="16px"
      type="iconfont"
      color="#006eff"
      @click="goToPod"
    />

    <div style="size: 14px; margin-left: 20px; margin-top: -4px">
      {{ data.name }}({{ data.namespace }})
    </div>
  </div>

  <el-card class="contend-card-container2">
    <el-col>
      <div style="float: right; height: 50px">
        <button class="pixiu-two-button" @click="GetPod">刷新</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">监控</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">日志</button>
        <button class="pixiu-two-button2" style="margin-left: 10px">删除</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">查看YAML</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">远程登陆</button>
        <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
          更多操作
        </button>
      </div>
    </el-col>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器管理" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"> </el-tab-pane>
      <el-tab-pane label="环境变量" name="four"></el-tab-pane>
      <el-tab-pane label="指标" name="five"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <div style="width: 50%">
        <el-form style="margin-top: 10px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >实例信息
              </span>
            </template>
          </el-form-item>
          <el-form-item style="margin-top: -10px">
            <template #label>
              <span class="detail-card-key-style">名称 </span>
            </template>
            <span class="detail-card-value-style" style="margin-left: 76px">
              {{ data.pod.metadata.name }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">命名空间 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.metadata.namespace }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">QoS类别 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.status.qosClass }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">所在节点 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.spec.nodeName }}: {{ data.pod.status.hostIP }}
            </span>
          </el-form-item>
          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">容器地址 </span>
            </template>
            <span class="detail-card-value-style">
              {{ data.pod.status.podIP }}
            </span>
          </el-form-item>

          <el-form-item style="margin-top: -5px">
            <template #label>
              <span class="detail-card-key-style">运行状态 </span>
            </template>
            <span class="detail-card-value-style"> Running </span>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >标签
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.pod.metadata.labels === undefined" style="margin-left: 10px">-</div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.labels"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >注释
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.pod.metadata.annotations === undefined" style="margin-left: 10px">
              -
            </div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.annotations"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="data.activeName === 'second'">
      <el-card class="app-docs" style="margin-top: 10px; height: 40px; margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">Pod 所包含的容器列表。</div>
      </el-card>

      <el-table
        :data="data.pod.spec.containers"
        stripe
        style="margin-top: 2px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column prop="container.name" sortable label="容器名称"> </el-table-column>

        <el-table-column
          prop="status"
          sortable
          label="状态"
          :formatter="formatterContainerStatus"
        />

        <el-table-column prop="status.restartCount" sortable label="重启次数" />

        <el-table-column prop="container.image" label="镜像" :formatter="formatterContainerImage" />

        <el-table-column prop="status" label="创建时间" sortable :formatter="formatterTime" />
      </el-table>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-table
        v-loading="data.loading"
        :data="data.deploymentEvents"
        stripe
        style="margin-top: 10px; width: 100%; margin-bottom: 25px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="kind" label="资源类型"> </el-table-column>
        <el-table-column prop="objectName" label="资源名称"> </el-table-column>
        <el-table-column prop="message" label="内容" width="500ox" />

        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="deleteEvent(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';
import {
  formatString,
  formatterContainerImage,
  formatterNamespace,
  formatterPodStatus,
  formatterRestartCount,
  formatterTime,
} from '@/utils/formatter';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',

  pod: {
    metadata: {},
    spec: {},
    status: {},
  },

  activeName: 'first',

  containerMap: {},
  containerStatusMap: {},
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetPod();
});

const GetPod = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.name}`,
    });
    data.pod = res;

    console.log('pod', data.pod);

    data.yaml = jsYaml.dump(data.pod, { quotingType: '"' });
    data.createTime = formatTimestamp(data.pod.metadata.creationTimestamp);

    data.containerMap = {};
    for (let c of data.pod.spec.containers) {
      data.containerMap[c.name] = c;
    }
    data.containerStatusMap = {};
    for (let cs of data.pod.status.containerStatuses) {
      data.containerStatusMap[cs.name] = cs;
    }
  } catch (error) {}
};

const goToPod = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/pods', query: queryParams });
};

const formatterContainerStatus = (row, column, cellValue) => {
  let status = '运行中';
  let color = '#28C65A';

  const state = cellValue.state;
  if (state.terminated !== undefined) {
    status = state.terminated.reason;
    color = '#0000FF';
  }

  return (
    <div style="display: flex">
      <div>
        <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color={color} />
      </div>
      <div style="margin-left: 6px"> {status}</div>
    </div>
  );
};
</script>
