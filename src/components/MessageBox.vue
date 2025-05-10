<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%">
    <span>{{ message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ '取消' }}</el-button>
        <el-button
          type="primary"
          @click="sure">
          {{ '确认' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialogVisible = ref(false);
const props = defineProps({ message: String, title: String });
const emit = defineEmits(['sureClick']);

const open = () => {
  dialogVisible.value = true;
};

const sure = () => {
  dialogVisible.value = false;
  emit('sureClick');
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped></style>
