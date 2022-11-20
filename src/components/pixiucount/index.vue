<template>
  {{ d.num.toFixed(0) }}
</template>

<script setup>
import gsap from 'gsap';
import { reactive, watch } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});

const d = reactive({
  num: 0,
});

const AnimateTovalue = () => {
  gsap.to(d, {
    duration: 1,
    num: props.value,
  });
};

AnimateTovalue();

watch(
  () => props.value,
  () => AnimateTovalue(),
);
</script>
<style scoped></style>
