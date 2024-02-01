<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToService"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-style">Service: {{ data.name }}({{ data.namespace }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 20px"></div>

    <el-tabs
      v-model="data.activeName"
      class="detail-head-style"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="端口组" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="four"></el-tab-pane>
      <el-tab-pane label="YAML" name="five"></el-tab-pane>
    </el-tabs>
  </el-card>

  <div v-if="data.activeName === 'first'">
    <el-card class="contend-card-container2">
      <div class="big-world-style" style="margin-bottom: 20px; margin-top: 6px">基本信息</div>

      <div v-if="data.service.metadata" style="margin-top: 8px; width: 100%; border-radius: 0px">
        <el-form-item label="名称" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 90px">
            {{ data.service.metadata.name }}
          </span>
        </el-form-item>
        <el-form-item label="命名空间" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 63px">
            {{ data.service.metadata.namespace }}
          </span>
        </el-form-item>
        <el-form-item label="创建时间" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 63px">
            {{ data.createTime }}
          </span>
        </el-form-item>
        <el-form-item label="Labels" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 75px">
            <div
              v-if="
                data.service.spec.selector === undefined ||
                data.service.spec.selector.matchLabels === undefined
              "
            >
              -
            </div>
            <div v-else>
              <div
                v-for="(item, index) in data.service.spec.selector.matchLabels"
                :key="item"
                style="margin-top: -1px"
              >
                {{ index }}: {{ item }}
              </div>
            </div>
          </span>
        </el-form-item>

        <el-form-item label="Annotations" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 42px">
            <div v-if="data.service.metadata.annotations === undefined">-</div>
            <div v-else>
              <div
                v-for="(item, index) in data.service.metadata.annotations"
                :key="item"
                style="margin-top: -1px"
              >
                {{ index }}: {{ item }}
              </div>
            </div>
          </span>
        </el-form-item>

        <el-form-item label="类型" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 88px">
            {{ data.service.spec.type }}
          </span>
        </el-form-item>

        <el-form-item label="服务IP" class="detail-tab-style">
          <span class="detail-base-info-style" style="margin-left: 75px">
            {{ data.service.spec.clusterIP }}
          </span>
        </el-form-item>
      </div></el-card
    >
  </div>

  <div v-if="data.activeName === 'second'">
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <button class="pixiu-two-button">刷新</button>
        </el-col>
      </el-row>

      <el-card class="contend-card-container2">
        <el-table
          v-loading="data.loading"
          :data="data.service.spec.ports"
          stripe
          style="margin-top: 10px; width: 100%; margin-bottom: 25px"
          header-row-class-name="pixiu-table-header"
          :cell-style="{
            'font-size': '12px',
            color: '#29292b',
          }"
        >
          <el-table-column type="selection" width="30px" />
          <el-table-column prop="name" label="端口名称" />
          <el-table-column prop="port" label="服务端口" />
          <el-table-column prop="protocol" label="协议"> </el-table-column>
          <el-table-column prop="targetPort" label="目标端口"> </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'five'">
    <div style="margin-top: 20px">
      <el-col>
        <button class="pixiu-two-button" style="width: 85px" @click="editYaml">编辑YAML</button>
        <button class="pixiu-two-button" style="margin-left: 10px" @click="copyYmal">复制</button>
        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="GetService"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 15px"></div>

    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly" :height="420"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
    </div>
  </div>
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

  service: '',
  yaml: '',

  createTime: '',
  activeName: 'first',
  loading: false,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  await GetService();
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
      url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/services/${data.name}`,
    });
    data.service = res;

    data.createTime = formatTimestamp(data.service.metadata.creationTimestamp);
    data.yaml = jsYaml.dump(data.service);
  } catch (error) {}
};

const goToService = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/services', query: queryParams });
};
</script>

<style scoped="scoped"></style>
