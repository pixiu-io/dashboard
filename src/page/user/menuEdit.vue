/** * Created by lei on 2022/10/21 */
<template>
  <el-dialog
    model-vaue="dialogVisble"
    style="color: #000000; font: 14px"
    width="460px"
    center
    @close="handleClose"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">添加菜单权限</div>
    </template>

    <el-form label-width="100px" :model="menu" style="max-width: 360px">
      <el-form-item label="菜单类型:" required>
        <el-radio-group v-model="menu.menu_type">
          <el-radio-button label="1">菜单</el-radio-button>
          <el-radio-button label="2">按钮</el-radio-button>
          <el-radio-button label="3">API</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称:" required>
        <el-input v-model="menu.name" />
      </el-form-item>

      <el-form-item label="上一级:">
        <el-tree-select
          ref="selectRef"
          v-model="menu.parent_id"
          :data="menuList"
          :props="{ value: 'id', label: 'name' }"
          check-strictly
          clearable
        />
      </el-form-item>

      <el-form-item label="描述:">
        <el-input v-model="menu.memo" required="" />
      </el-form-item>
      <el-form-item label="排序值:">
        <el-input-number v-model="menu.sequence" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="URL:">
        <el-input v-model="menu.url" />
      </el-form-item>

      <el-form-item
        v-if="menu.menu_type == 3 || menu.menu_type == 2"
        id="ss"
        v-model="menu.menu_type"
        label="请求方式:"
      >
        <el-select v-model="menu.method" clearable placeholder="请选择">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="menu.menu_type == 1" v-model="menu.menu_type" label="图标:">
        <el-input v-model="menu.icon" required="" />
      </el-form-item>
      <el-form-item
        v-if="menu.menu_type == 3 || menu.menu_type == 2"
        v-model="menu.menu_type"
        label="Code:"
      >
        <el-input v-model="menu.code" required="" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="menu.status"
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
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleUptdaeMenus()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { toRefs, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();

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
const props = defineProps({
  menu: {
    type: Object,
    default: () => {},
  },
  menuList: {
    type: Array,
    default: () => [],
  },
});
const { menu, menuList } = toRefs(props);

const emits = defineEmits(['update:modelValue', 'valueChange']);

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleUptdaeMenus = async () => {
  if (menu.value.parent_id === '') {
    menu.value.parent_id = 0;
  }

  menu.value.menu_type = parseInt(menu.value.menu_type);
  try {
    await proxy
      .$http({
        method: 'put',
        url: `/menus/${menu.value.id}`,
        data: menu.value,
      })
      .then(() => {
        handleClose();
        emits('valueChange');
        ElMessage({
          type: 'success',
          message: '修改成功',
        });
      });
  } catch (error) {}
};
</script>
