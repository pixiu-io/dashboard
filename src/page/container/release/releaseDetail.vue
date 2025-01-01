<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToNode">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-helm" size="75px" type="iconfont" color="#006eff" />
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
          <button class="pixiu-two-button" @click="GetRelease">刷新</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
            更多操作
          </button>
        </div>
      </div>
    </el-space>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import { formatterHelmChart, formatterNamespace, formatterTime } from '@/utils/formatter';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getRelease } from '@/services/kubernetes/releaseService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',
  createTime: '',

  release: {},
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetRelease();
});

const GetRelease = async () => {
  const [p, err] = await getRelease(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err);
    return;
  }

  data.release = p;
  data.createTime = formatTimestamp(data.release.info.first_deployed);
};
</script>
