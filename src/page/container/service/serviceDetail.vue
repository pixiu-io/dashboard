<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToService">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-rongqizu" size="75px" type="iconfont" color="#006eff" />
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 80px;
        "
      >
        <div
          class="breadcrumb-create-style"
          style="font-size: 17px; margin-top: -10px; margin-left: 10px"
        >
          {{ data.name }}
        </div>

        <div style="margin-bottom: 10px">
          <span class="detail-card-key-style" style="font-size: 12.5px">创建时间 </span>
          <span class="detail-card-value-style" style="margin-left: 5px; font-size: 12.5px">
            {{ data.createTime }}</span
          >
        </div>

        <div style="margin-bottom: -10px; margin-left: 10px">
          <button class="pixiu-two-button" @click="GetService">刷新</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
          </button>

          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
            更多操作
          </button>
        </div>
      </div>
    </el-space>
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
      <el-tab-pane label="服务详情" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"> </el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span
              class="detail-card-key-style"
              style="font-size: 14px; color: black; font-weight: bold"
              >实例信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">实例名称 </span>
            <span class="detail-card-value-style"> {{ data.object.metadata.name }}</span>
          </el-col>
          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">命名空间 </span>
              <span class="detail-card-value-style">
                {{ data.object.metadata.namespace }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">创建时间 </span>
              <span class="detail-card-value-style"> {{ data.createTime }}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">类型 </span>
            <span class="detail-card-value-style"> {{ data.object.spec.type }}</span>
          </el-col>
          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">服务IP </span>
              <span class="detail-card-value-style">
                {{ data.object.spec.clusterIP }}
              </span>
            </el-row>
          </el-col>
        </el-row>

        <div style="margin-top: 20px"></div>

        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000">标签 </span>
          </template>
        </el-form-item>

        <el-form-item style="margin-top: -10px">
          <div v-if="data.object.metadata.labels === undefined" style="margin-left: 10px">-</div>
          <div v-else style="margin-top: -8px">
            <div
              v-for="(item, index) in data.object.metadata.labels"
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
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000">注释 </span>
          </template>
        </el-form-item>

        <el-form-item style="margin-top: -10px">
          <div v-if="data.object.metadata.annotations === undefined" style="margin-left: 10px">
            -
          </div>
          <div v-else style="margin-top: -8px">
            <div
              v-for="(item, index) in data.object.metadata.annotations"
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

    <div v-if="data.activeName === 'second'">
      <div style="margin-top: 10px">
        <span class="detail-card-key-style">集群域名 </span>
        <span class="detail-card-value-style" style="margin-left: 15px">
          {{ data.object.metadata.name }}.{{ data.namespace }}</span
        >
      </div>

      <el-card class="detail-docs" style="margin-left: 10px; margin-top: 20px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">展示 service 关联的全部端口组</div>
      </el-card>
      <el-table
        v-loading="data.loading"
        :data="data.object.spec.ports"
        style="margin-top: -15px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column prop="name" label="端口名称" />
        <el-table-column prop="port" label="服务端口" />
        <el-table-column prop="protocol" label="协议"> </el-table-column>
        <el-table-column prop="targetPort" label="目标端口"> </el-table-column>
      </el-table>

      <el-card class="detail-docs" style="margin-left: 10px; margin-top: 30px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理关联在 Service 上的 pod 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="GetServicePods"
            >
              查询
            </button>

            <el-input
              v-model="data.podData.pageInfo.nameSelector"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="GetServicePods"
              @input="GetServicePods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="GetServicePods"
                />
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.podData.loading"
        :data="data.podData.tableData"
        stripe
        style="margin-top: 10px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称" min-width="120px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column prop="metadata.namespace" label="命名空间"> </el-table-column>

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="60px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
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

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  service: {
    metadata: {},
    spec: {},
    status: {},
  },

  object: {
    metadata: {},
    spec: {},
    status: {},
  },

  podData: {
    loading: false,
    pods: [],
    tableData: [],
    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

  yaml: '',

  createTime: '',
  activeName: 'first',
  loading: false,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetService();
});

const { toClipboard } = useClipboard();

const copyYmal = async () => {
  try {
    await toClipboard(data.yaml);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const GetService = async () => {
  try {
    const res = await proxy.$http({
      method: 'get',
      url: `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/services/${data.name}`,
    });
    data.service = res;
    data.object = res;

    data.createTime = formatTimestamp(data.service.metadata.creationTimestamp);
    data.yaml = jsYaml.dump(data.service, { quotingType: '"' });
  } catch (error) {}
};

const goToService = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/services', query: queryParams });
};
</script>

<style scoped="scoped"></style>
