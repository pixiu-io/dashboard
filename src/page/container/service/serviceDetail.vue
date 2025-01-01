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
      <el-tab-pane label="端口组" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"> </el-tab-pane>
      <el-tab-pane label="YAML" name="four"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
              >实例信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">名称 </span>
            <span class="detail-card-value-style" style="margin-left: 55px">
              {{ data.object.metadata.name }}</span
            >
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
            color: '#191919',
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
