<template>
  <el-dialog :model-value="visible" width="640px" @close="$emit('close')" :title="name">
    <div class="space-y-4">
      <p class="text-sm text-gray-700">版本：{{ version }}</p>
      <p class="text-sm text-gray-700">描述：{{ description }}</p>
      <div v-if="values" class="mt-4">
        <h4 class="font-medium">Values 示例</h4>
        <pre class="bg-gray-100 p-2 overflow-auto text-xs">{{ values }}</pre>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('close')">关闭</el-button>
      <el-button type="primary" @click="$emit('close')">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: { type: Boolean, required: true },
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, required: false },
  values: { type: String, required: false },
})
</script>

<style scoped>
pre { max-height: 240px; }
</style>
