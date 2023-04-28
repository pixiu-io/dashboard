<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <el-row>
        <el-col>
          <span style="font-weight: bold; font-size: 18px; vertical-align: middle">
            {{ $t(`container.container.title`) }}
          </span>
          <span
            style="font-size: 15px; margin-left: 10px; vertical-align: middle; margin-right: 10px"
          >
            {{ $t(`container.container.region`) }}
          </span>

          <el-select v-model="cloudStore.defaultOption" placeholder="Select" style="width: 102px">
            <template #prefix>
              <pixiu-icon size="20px" name="icon-diyufenbu" type="iconfont"></pixiu-icon>
            </template>
            <el-option
              v-for="item in cloudStore.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>

          <span
            style="
              font-size: 12px;
              float: right;
              color: rgba(0, 0, 0, 0.9);
              vertical-align: middle;
              margin-left: 5px;
            "
          >
            管理指南
            <el-icon style="vertical-align: middle; margin-right: 10px">
              <component :is="'Edit'" />
            </el-icon>
          </span>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="app-docs">
      <div>
        <el-icon
          style="
            vertical-align: middle;
            font-size: 18px;
            margin-left: -20px;
            margin-right: 8px;
            margin-top: -25px;
          "
          ><WarningFilled
        /></el-icon>

        <div style="vertical-align: middle; margin-top: -27px; margin-left: 10px">
          Kubernetnes 节点能力全面升级，支持更多集群版本。
        </div>
      </div>
    </el-card>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'user:cloud:add'"
            class="pixiu-button"
            type="primary"
            style="margin-left: 1px"
            @click="cloudStore.createCloud"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            新建集群
          </el-button>

          <el-input
            v-model="cloudStore.pageInfo.query"
            placeholder="多个过滤标签用回车分隔"
            style="width: 560px; float: right"
            clearable
            @input="cloudStore.getCloudList"
            @clear="cloudStore.getCloudList"
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <component :is="'Search'" />
              </el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="cloudStore.loading"
          :data="cloudStore.cloudList"
          stripe
          style="margin-top: 2px; width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="38" /> -->

          <el-table-column prop="name" label="名称/ID" width="200">
            <template #default="scope">
              <el-link
                style="color: #006eff"
                type="primary"
                @click="cloudStore.jumpRoute(scope.row)"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            :formatter="cloudStatusFormatter"
            prop="status"
            label="状态"
            width="160"
          />

          <el-table-column
            :formatter="cloudTypeFormatter"
            prop="cloud_type"
            label="集群类型"
            width="180"
          />
          <el-table-column prop="kube_version" width="200">
            <template #header>
              <Icon icon="QuestionFilled" desc="原生 kubernetes 的版本"> kubernetes版本 </Icon>
            </template>
          </el-table-column>
          <el-table-column prop="node_number" label="节点数" width="160" />
          <el-table-column prop="resources" label="资源量" :formatter="formatterResource" />

          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button
                v-permissions="'user:cloud:setting'"
                size="small"
                type="text"
                style="margin-right: -20px; margin-left: -10px; color: #006eff"
                @click="handleEdit(scope.row)"
              >
                设置
              </el-button>

              <el-button
                v-permissions="'user:cloud:delete'"
                type="text"
                size="small"
                style="margin-right: 2px; color: #006eff"
                @click="cloudStore.deleteCloud(scope.row)"
              >
                删除
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item style="color: #006eff"> 启动 </el-dropdown-item>
                    <el-dropdown-item style="color: #006eff"> 详情 </el-dropdown-item>
                    <el-dropdown-item style="color: #006eff"> 终端 </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template #empty>
            <div class="noResource">
              没有任何容器集群

              <button class="app-pixiu-btn--link" @click="cloudStore.createCloud">
                [立即创建]
              </button>
            </div>
          </template>
        </el-table>

        <!-- 分页区域 -->
        <pagination :total="cloudStore.total" @on-change="cloudStore.onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <el-dialog
    v-model="cloudStore.createCloudVisible"
    style="color: #000000; font: 14px"
    width="1200px"
    center
    @close="cloudStore.closeModal"
  >
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">选择集群类型</div>
    </template>
    <el-row :gutter="20">
      <pixiu-radio-card
        :type="1"
        :default-type="cloudStore.cloudType"
        :span="2"
        @click="cloudStore.changeActive"
        ><div>
          <div style="margin-top: 10px; font: 14px; font-weight: 700; color: #000000">标准集群</div>

          <div style="margin-top: 20px; font: 12px; color: #00000066">
            可以将用户本地基础设施的 Kubernetes 集群或者其他云厂商的 Kubernetes
            集群注册到容器服务进行统一管理。
          </div>
          <div style="margin-top: 20px; color: #000 !important">多云管理，灵活接入各种计算资源</div>
          <div style="margin-top: 8px; color: #000 !important">
            对接现有 DevOps 系统，实现多云发布
          </div>
          <div style="margin-top: 8px; color: #000 !important">完全兼容开源 Kubernetes 集群</div>
          <div style="margin-top: 20px; color: #000 !important; margin-bottom: 50px">
            生态开源 多云管理
          </div>
        </div></pixiu-radio-card
      >

      <pixiu-radio-card
        :type="2"
        :default-type="cloudStore.cloudType"
        :span="2"
        @click="cloudStore.changeActive"
      >
        <div style="margin-top: 10px; font: 14px; font-weight: 700; color: #000000">自建集群</div>

        <div style="margin-top: 20px; font: 12px; color: #00000066">
          默认集群类型，完全兼容开源 Kubernetes
          集群标准功能，并强化节点管理、集群网络、容器调度等能力。
        </div>

        <div style="margin-top: 20px; color: #000 !important">
          标准原生 Kubernets 集群、丰富的自定义接口
        </div>
        <div style="margin-top: 8px; color: #000 !important">适用于高稳定性、定制化集群业务</div>
        <div style="margin-top: 8px; color: #000 !important">灵活的集群网络、容器调度</div>
        <div style="margin-top: 20px; color: #000 !important; margin-bottom: 50px">
          标准K8s集群 支持原生节点
        </div>
      </pixiu-radio-card>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cloudStore.closeModal">取消</el-button>
        <el-button type="primary" @click="cloudStore.confirmCreateCloud">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { onMounted } from 'vue';
import PixiuRadioCard from '@/components/radioCard/index.vue';
import Icon from '@/components/pixiuTooltip/index.vue';
import Pagination from '@/components/pagination/index.vue';
import useCloudStore from '@/stores/useCloud';

const cloudStore = useCloudStore();

onMounted(() => {
  cloudStore.getCloudList();
});

// const cloudStatus = {
//   0: '运行中',
//   1: '集群异常',
//   2: '构建中',
//   3: '删除中',
//   4: '等待构建',
// };

const cloudStatus = {
  0: {
    icon: 'icon-B',
    text: '运行中',
    color: '#00FF00', // 绿色
  },
  1: {
    icon: 'icon-yichang',
    text: '集群异常',
    color: '#FF0000', // 红色
  },
  2: {
    icon: 'icon-dlf-shujuhugoujian',
    text: '构建中',
    color: '#0000FF', // 蓝色
  },
  3: {
    icon: 'icon-shanchu',
    text: ' 删除中',
    color: '#FF00FF', // 牡丹红
  },
  4: {
    icon: 'icon-icon-',
    text: '等待构建',
    color: '#FFFF00', // 黄色
  },
};

const cloudTypes = {
  1: '标准集群',
  2: '自建集群',
};

const cloudTypeFormatter = (row, column, cellValue) => (
  <div style="display:flex;align-items:center">
    <el-space>
      <div>{cloudTypes[cellValue]}</div>
    </el-space>
  </div>
);

const cloudStatusFormatter = (row, column, cellValue) => (
  <div style="display:flex;align-items:center">
    <el-space size={8}>
      <pixiu-icon
        size="25px"
        name={cloudStatus[cellValue].icon}
        type="iconfont"
        color={cloudStatus[cellValue].color}
      ></pixiu-icon>
      <div>{cloudStatus[cellValue].text}</div>
    </el-space>
  </div>
);

const formatterResource = (row, column, cellValue) => {
  const { status } = row;
  return (
    <div style="display:flex;flex-direction:column">
      <el-space>
        <span style="font-weight:bold">CPU:</span>
        <span>{status}</span>
      </el-space>
      <el-space>
        <span style="font-weight:bold">内存:</span>
        <span>{status}</span>
      </el-space>
    </div>
  );
};
</script>

<style>
.box-card {
  margin-top: 20px;
  /* width: 480px; */
}
.el-main {
  background-color: #f3f4f7;
}
.app-docs {
  margin-top: 20px;
  height: 60px;
  font-size: 12px;
  line-height: inherit;
  padding: 14px 20px;
  vertical-align: middle;
  color: #002da0;
  border: 1px solid #d5e7ff;
  border-radius: 0;
  background: #d5e7ff;
  position: relative;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #006eff;
  display: flex;
  font-size: 12px;
  margin-top: 6px;
}
.dropdown-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.app-pixiu-btn--link {
  text-align: center;
  height: auto;
  padding: 0;
  vertical-align: middle;
  line-height: 1.5;
  border: none;
  color: #006eff;
  margin-left: 2px;
  background-color: #fff;
  cursor: pointer;
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 26px;
  color: #28c65a;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.noResource {
  text-align: center;
  font-size: 10px;
  color: black;
}

.pixiu-button {
  height: 35px;
  width: 115px;
  border-radius: 0%;
  color: white;
  border: none;
  background-color: #0052d9;
  cursor: pointer;
}
</style>
