<template>
  <el-col :span="12"
    ><div @click="abc(props.type)">
      <el-row
        :class="`${
          props.type === props.defaultType
            ? 'pixiu-card__active'
            : 'pixiu-card__default'
        }`"
      >
        <el-col
          :span="props.span"
          style="
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            :class="`${
              props.type === props.defaultType
                ? 'pixiu-radio__active'
                : 'pixiu-radio__default'
            }`"
          ></div>
        </el-col>
        <el-col :span="24 - props.span">
          <slot />
        </el-col>
      </el-row></div
  ></el-col>
</template>

<script setup>
const props = defineProps({
  type: Number,
  span: {
    type: Number,
    default: 4,
  },
  defaultType: Number,
});
const emits = defineEmits(["click"]);

const abc = (value) => {
  emits("click", value);
};
</script>

<style scoped>
.pixiu-card__default {
  border: 1px solid #cccccc;
  cursor: pointer;
}

.pixiu-card__active {
  border: 1px solid #409eff;
  cursor: pointer;
}

.pixiu-card__default:hover {
  border: 1px solid #409eff;
}

.pixiu-card__default:hover .pixiu-radio__default {
  border: 1px solid #409eff;
}

.pixiu-radio__active {
  height: 4px;
  width: 4px;
  border: 5px solid #409eff;
  border-radius: 50%;
  cursor: pointer;
}

.pixiu-radio__default {
  height: 12px;
  width: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  cursor: pointer;
}

/* .pixiu-radio__default:hover {
  border: 1px solid #409eff;
} */
</style>
