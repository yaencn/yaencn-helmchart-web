<template>
  <div class="relative group">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <el-icon class="text-gray-400 group-focus-within:text-blue-500 transition-colors"><Search /></el-icon>
    </div>
    <input
      v-model="q"
      type="text"
      placeholder="搜索 Chart、关键字或作者..."
      @input="onInput"
      class="block w-full pl-11 pr-4 py-4 bg-white border-none shadow-lg rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['search'])
const q = ref('')

const onInput = () => {
  emit('search', q.value)
}
</script>
