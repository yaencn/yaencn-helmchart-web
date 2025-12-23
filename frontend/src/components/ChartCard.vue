<template>
  <el-card class="chart-card hover:shadow-xl transition-all duration-300 border-none shadow-md">
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <el-icon :size="24"><Box /></el-icon>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ name }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{{ version }}</span>
              <span v-if="appVersion" class="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">应用版本：{{ appVersion }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p class="text-gray-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
        {{ description || '暂无描述' }}
      </p>
      
      <div class="flex justify-between items-center pt-4 border-t border-gray-50">
        <div class="flex flex-col">
          <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Updated</span>
          <span class="text-xs text-gray-600">{{ updated }}</span>
        </div>
        <el-button type="primary" size="default" round class="px-6" @click="$emit('details')">
          详情
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'

const props = defineProps({
  name: { type: String, required: true },
  version: { type: String, required: true },
  appVersion: { type: String, required: false },
  description: { type: String, required: false },
  updated: { type: String, required: false },
})
</script>

<style scoped>
.chart-card {
  border-radius: 16px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
