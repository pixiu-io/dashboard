<template>
  <div style="width: 100%; font-size: 14px; padding: 6px 0px 6px 10px; box-sizing: border-box">
    <el-popover
      :aria-hidden="isPopoverFocused"
      placement="bottom-start"
      :width="200"
      :visible="visible"
      :show-arrow="false"
    >
      <template #reference>
        <div class="input-container">
          <div
            style="
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
            "
          >
            <div style="display: flex; align-items: center; gap: 8px; flex-grow: 1">
              <el-tag
                v-for="(tag, index) in localDynamicTags"
                :key="index"
                type="info"
                :closable="true"
                :disable-transitions="false"
                style="flex-shrink: 1"
                @close="handleClose(tag)"
              >
                {{ tag.label + ':' + tag.inputValue }}
              </el-tag>
              <span
                v-if="selectedItem.label"
                style="flex-shrink: 0; flex-grow: 0; flex-basis: auto"
                >{{ selectedItem.label + ':' }}</span
              >
              <input
                ref="input"
                v-model="inputValue"
                type="text"
                class="input__inner"
                autocomplete="false"
                tabindex="0"
                :placeholder="placeholder"
                @focus="openDropdown"
                @blur="closeDropdown"
                @keydown.enter="closeDropdown"
              />
            </div>
            <slot name="suffix"></slot>
            <div style="padding-right: 10px"></div>
          </div>
        </div>
      </template>
      <template #default>
        <ul class="select-dropdown">
          <li
            v-for="(item, index) in options"
            :key="item.value"
            class="select-dropdown__item"
            @click="handleSelect(item, index)"
          >
            {{ item.label }}
          </li>
        </ul>
      </template>
    </el-popover>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElInput, ElTag, ElSpace, ElPopover } from 'element-plus';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  inputValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:tags', 'update:inputValue', 'update:options']);

const isPopoverFocused = ref(false);
const selectedItem = ref({});
const input = ref(null);
const inputValue = ref(props.inputValue);
const localOptions = reactive(props.options);
const localDynamicTags = reactive([]);
const visible = ref(false);

const handleSelect = (item, index) => {
  localOptions.splice(index, 1);
  if (input.value) {
    input.value.focus();
    selectedItem.value = { ...item, index };
  }
  visible.value = false;
  isPopoverFocused.value = false;
};

const updateDynamicTags = () => {
  emit('update:tags', localDynamicTags);
};

const openDropdown = () => {
  if (selectedItem.value.label || localOptions.length === 0) {
    return;
  }
  visible.value = true;
  isPopoverFocused.value = true;
};

const closeDropdown = () => {
  visible.value = false;
  isPopoverFocused.value = false;
  if (inputValue.value && selectedItem.value.label) {
    const indexItem = { ...selectedItem.value, inputValue: inputValue.value };
    localDynamicTags.push(indexItem);
    updateDynamicTags();
  }
  if (!inputValue.value && selectedItem.value.label) {
    localOptions.splice(selectedItem.value.index, 0, {
      label: selectedItem.value.label,
      value: selectedItem.value.value,
    });
  }
  selectedItem.value = {};
  inputValue.value = '';
};

const handleClose = (tag) => {
  localOptions.splice(tag.index, 0, {
    label: tag.label,
    value: tag.value,
  });
  localDynamicTags.splice(localDynamicTags.indexOf(tag), 1);
  updateDynamicTags();
};
</script>
<style scoped>
.input__inner {
  -webkit-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  appearance: none;
  background: none;
  border: none;
  box-sizing: border-box;
  color: #606266;
  flex-grow: 1;
  font-size: inherit;
  height: inherit;
  line-height: inherit;
  outline: none;
  padding: 0;
  width: 100%;
}
.input__suffix {
  padding: 2px 0px;
  cursor: pointer;
}
input[type='text' i] {
  padding-block: 1px;
  padding-inline: 2px;
}
.input__inner:focus {
  outline: none;
}
.input-container {
  padding: inherit;
  border: 1px solid #dcdfe6;
  display: flex;
  font-size: inherit;
  align-items: center;
  background-color: #fff;
}
.input-container:hover {
  border-color: #aaa;
}
.input-container:focus-within {
  border-color: #409eff;
}
.select-dropdown {
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #fff;
}
.select-dropdown__item {
  cursor: pointer;
  padding: 0;
  margin: 0;
  list-style-type: none;
  height: 34px;
  line-height: 34px;
}
.select-dropdown__item:hover {
  background-color: #f5f5f5;
  color: #409eff;
}
</style>
