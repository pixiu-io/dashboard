<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 菜单权限列表 </span>
    </el-card>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'user:cloud:add'"
            type="primary"
            style="margin-left: 1px"
            @click="createRole()"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            添加菜单权限
          </el-button>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <el-table :data="data.menuList" stripe style="margin-top: 2px; width: 100%" row-key="id">
          <el-table-column prop="id" label="菜单ID" width="180" />
          <el-table-column prop="name" label="菜单名称" width="120" />
          <el-table-column prop="menu_type" label="类型" width="80">
            <template #default="scope">
              <span v-if="scope.row.menu_type === 1" style="font-size: 13px">
                <el-tag class="ml-2" type="success" effect="dark">菜单</el-tag>
              </span>
              <span v-if="scope.row.menu_type === 2" style="font-size: 13px">
                <el-tag class="ml-2" type="warning" effect="dark">按钮</el-tag>
              </span>
              <span v-if="scope.row.menu_type === 3" style="font-size: 13px">
                <el-tag class="ml-2" effect="dark">API</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="描述" width="120" />
          <el-table-column prop="url" label="URL" width="250" />
          <el-table-column prop="code" label="Code" width="200" />

          <el-table-column prop="method" label="请求方式" width="200">
            <template #default="scope">
              <span v-if="scope.row.method === 'GET'" style="font-size: 13px" text="bold">
                <el-tag class="ml-2">{{ scope.row.method }}</el-tag>
              </span>
              <span v-if="scope.row.method === 'POST'" style="font-size: 13px">
                <el-tag class="ml-2" type="success">{{ scope.row.method }}</el-tag>
              </span>
              <span v-if="scope.row.method === 'DELETE'" style="font-size: 13px">
                <el-tag class="ml-2" type="danger">{{ scope.row.method }}</el-tag>
              </span>
              <span v-if="scope.row.method === 'PUT'" style="font-size: 13px">
                <el-tag class="ml-2" type="warning">{{ scope.row.method }}</el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="icon" label="图标" width="180"> </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                style="--el-switch-on-color: #409eff; --el-switch-off-color: #ff4949"
                :active-value="1"
                :inactive-value="0"
                size="small"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
                width="45px"
                @change="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="sequence" label="排序" width="80" />
          <el-table-column prop="gmt_create" label="创建时间" width="220" />
          <el-table-column fixed="right" label="操作" width="250">
            <template #default="scope">
              <el-button
                v-permissions="'user:cloud:delete'"
                text
                size="small"
                style="margin-right: 10px; color: #006eff"
                @click="deleteMenu(scope.row)"
              >
                删除
              </el-button>
              <el-button
                v-permissions="'user:cloud:delete'"
                text
                size="small"
                style="margin-right: 10px; color: #006eff"
                @click="handleEdit(scope.row)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.total" @on-change="onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <MenuEdit
    v-if="menuEdit.dialogVisble"
    v-model="menuEdit.dialogVisble"
    :menu="menuEdit.menu"
    :menu-list="menuEdit.menuList"
    @value-change="getMenusList"
  />
  <!-- 添加菜单按钮信息 -->
  <el-dialog
    v-if="data.createMenuVisible"
    v-model="data.createMenuVisible"
    style="color: #000000; font: 14px"
    width="460px"
    center
    @close="data.createMenuVisible = false"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">添加菜单权限</div>
    </template>

    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="data.menuForm"
      style="max-width: 360px"
    >
      <el-form-item label="菜单类型:" required>
        <el-radio-group v-model="data.menuForm.menu_type">
          <el-radio-button label="1">菜单</el-radio-button>
          <el-radio-button label="2">按钮</el-radio-button>
          <el-radio-button label="3">API</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称:" required>
        <el-input v-model="data.menuForm.name" />
      </el-form-item>

      <el-form-item label="上一级:">
        <el-tree-select
          ref="selectRef"
          v-model="data.menuForm.parent_id"
          :data="menuEdit.menuList"
          :props="{ value: 'id', label: 'name' }"
          check-strictly
          clearable
        />
      </el-form-item>

      <el-form-item label="描述:">
        <el-input v-model="data.menuForm.memo" required />
      </el-form-item>
      <el-form-item label="排序值:">
        <el-input-number
          v-model="data.menuForm.sequence"
          :min="1"
          :max="10"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="URL:" required>
        <el-input v-model="data.menuForm.url" />
      </el-form-item>

      <el-form-item
        v-if="data.menuForm.menu_type == 3 || data.menuForm.menu_type == 2"
        v-model="data.menuForm.menu_type"
        label="请求方式:"
      >
        <el-select v-model="data.menuForm.method" clearable placeholder="Select">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="data.menuForm.menu_type == 1"
        v-model="data.menuForm.menu_type"
        label="图标:"
      >
        <el-input v-model="data.menuForm.icon" required="" />
      </el-form-item>
      <el-form-item
        v-if="data.menuForm.menu_type == 3 || data.menuForm.menu_type == 2"
        v-model="data.menuForm.menu_type"
        label="Code:"
      >
        <el-input v-model="data.menuForm.code" required="" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="data.menuForm.status"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-value="1"
          :inactive-value="0"
          size="large"
          inline-prompt
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.createMenuVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateMenus">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MenuEdit from './menuEdit.vue';
import Pagination from '@/components/pagination/index.vue';

const menuEdit = reactive({
  dialogVisble: false,
  menu: {},
  menuList: [],
});

const selectRef = ref(null);

const methodOptions = [
  {
    value: 'GET',
    label: 'GET',
  },
  {
    value: 'POST',
    label: 'POST',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'PUT',
    label: 'PUT',
  },
];

const { proxy } = getCurrentInstance();
const data = reactive({
  pageInfo: {
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },
  loading: false,
  // 触发创建页面
  createMenuVisible: false,
  menuForm: {
    memo: '',
    parent_id: null,
    name: '',
    sequence: '',
    status: 1,
    menu_type: 1,
    icon: '',
    code: '',
    method: '',
  },
  total: 0,
  name: '',
  roleList: [],
  menus: [],
  menuList: [],
});

onMounted(() => {
  getMenusList();
  getMenusByMenuType();
});

const deleteMenu = async (row) => {
  ElMessageBox.confirm(`此操作将删除 ${row.name}菜单 . 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {
      const res = proxy
        .$http({
          method: 'delete',
          url: `/menus/${row.id}`,
        })
        .then(() => {
          getMenusList();
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        })
        .catch((err) => {});
    })
    .catch(() => {}); // 取消
};

const createRole = () => {
  data.createMenuVisible = true;
};

const handleEdit = (menu) => {
  if (menu.parent_id == 0) {
    menu.parent_id = '';
  }
  menuEdit.dialogVisble = true;
  menuEdit.menu = JSON.parse(JSON.stringify(menu));
};

const confirmCreateMenus = async () => {
  data.menuForm.menu_type = parseInt(data.menuForm.menu_type);
  try {
    await proxy
      .$http({
        method: 'post',
        url: '/menus',
        data: data.menuForm,
      })
      .then(() => {
        data.createMenuVisible = false;
        getMenusList();
        ElMessage({
          type: 'success',
          message: '添加成功',
        });
      });
  } catch (error) {}
};

const changeStatus = async (menu) => {
  try {
    await proxy
      .$http({
        method: 'put',
        url: `/menus/${menu.id}/status/${menu.status}`,
      })
      .then(() => {
        getMenusList();
        ElMessage({
          type: 'success',
          message: '更新成功',
        });
      });
  } catch (error) {}
};
const getMenusList = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: '/menus',
    data: data.pageInfo,
  });
  data.menuList = res.menus;
  data.total = res.total;
};

// 分页
const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;
  getMenusList();
};

const getMenusByMenuType = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: '/menus',
    data: { menu_type: 1 },
  });
  menuEdit.menuList = res.menus;
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
</style>
