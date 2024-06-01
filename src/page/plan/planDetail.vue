<template>plan detail</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime } from '@/utils/formatter';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getPodsByLabels, deletePod, getPodLog } from '@/services/kubernetes/podService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  name: '',
  planId: 0,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
});

onMounted(async () => {
  data.name = proxy.$route.query.name;
  data.planId = proxy.$route.query.planId;
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
};
</script>

<style scoped="scoped"></style>
