<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        雅恩 Kubernetes 应用部署
      </h2>
      <p class="mt-4 text-xl text-gray-500">
        我们的 HelmChart 仓库提供精选的 Kubernetes 应用包，帮助您快速、可靠地部署和管理云原生应用。
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <div class="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm">
          $ helm repo add yaencn https://helm.yaencn.com/charts
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <el-card v-for="(versions, name) in charts" :key="name" class="hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">{{ name }}</span>
            <el-tag size="small">{{ versions[0].version }}</el-tag>
          </div>
        </template>
        <p class="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
          {{ versions[0].description }}
        </p>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">更新于: {{ formatDate(versions[0].created) }}</span>
          <el-button type="primary" size="small" plain @click="showDetails(name, versions[0])">详情</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const charts = ref<any>({})

const fetchCharts = async () => {
  try {
    const response = await axios.get('/api/v1/charts/list')
    charts.value = response.data.entries || {}
  } catch (error) {
    console.error('Failed to fetch charts', error)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

const showDetails = (name: string, version: any) => {
  // Implementation for details dialog
}

onMounted(fetchCharts)
</script>
