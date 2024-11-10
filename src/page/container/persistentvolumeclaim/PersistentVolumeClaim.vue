<template>
  <Description :description="'持久卷声明定义了存储需求，Kubernetes 会根据持久卷声明创建持久卷。'" />

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createPersistentVolumeClaim">新建</button>
        <button
          class="pixiu-two-button2"
          style="margin-left: 10px"
          @click="getPersistentVolumeClaims"
        >
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getPersistentVolumeClaims"
          @input="getPersistentVolumeClaims"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getPersistentVolumeClaims"
            />
          </template>
        </el-input>
        <div style="float: right">
          <el-switch
            v-model="data.autoRefresh"
            inline-prompt
            width="36px"
            @change="startAutoRefresh"
          /><span style="font-size: 13px; margin-left: 5px; margin-right: 10px">自动刷新</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  ref,
  watch,
  provide,
} from 'vue';
import jsYaml from 'js-yaml';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import PixiuTag from '@/components/pixiuTag/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getPodsByLabels, deletePod, getPodLog } from '@/services/kubernetes/podService';

import {
  formatterImage,
  formatterTime,
  formatterNamespace,
  runningFormatter,
  formatterContainerImage,
  formatString,
} from '@/utils/formatter';
import { getEventList, deleteEvent } from '@/services/kubernetes/eventService';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import PixiuLog from '@/components/pixiulog/index.vue';

const data = reactive({
  cluster: '',
  namespace: 'default',

  autoRefresh: true,
  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },

  tableData: [],
  loading: false,
});

const getPersistentVolumeClaims = async () => {};
</script>

<style></style>
