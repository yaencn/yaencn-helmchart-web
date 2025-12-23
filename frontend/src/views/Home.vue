<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">雅恩 Kubernetes 应用部署</h2>
      <p class="mt-4 text-xl text-gray-500">我们的 HelmChart 仓库提供精选的 Kubernetes 应用包，帮助您快速、可靠地部署和管理云原生应用。</p>
      <div class="mt-8 flex justify-center gap-4">
        <div class="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm shadow-lg">
          <span class="text-blue-400">$</span> helm repo add yaencn https://helm.yaencn.com/charts
        </div>
      </div>
      <div class="mt-8 flex justify-center">
        <div class="w-full max-w-3xl">
          <SearchBar @search="onSearch" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ChartCard
        v-for="item in filtered"
        :key="item.name"
        :name="item.name"
        :version="item.version"
        :appVersion="item.appVersion"
        :description="item.description"
        :updated="item.updated"
        @details="openDetails(item)"
      />
    </div>

    <ChartDetails
      :visible="detailsVisible"
      :name="detailItem.name || ''"
      :version="detailItem.version || ''"
      :appVersion="detailItem.appVersion || ''"
      :description="detailItem.description || ''"
      :values="detailItem.values || ''"
      @close="detailsVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import SearchBar from '@/components/SearchBar.vue'
import ChartCard from '@/components/ChartCard.vue'
import ChartDetails from '@/components/ChartDetails.vue'

const charts = ref<any[]>([])
const query = ref('')

const fetchCharts = async () => {
  try {
    const response = await axios.get('/api/v1/charts/list')
    // transform entries object into array of representative items
    const entries = response.data.entries || {}
    const arr: any[] = []
    for (const [name, versions] of Object.entries(entries)) {
      const v = (versions as any[])[0] || {}
      arr.push({
        name,
        version: v.version || '',
        appVersion: v.appVersion || '',
        description: v.description || '',
        updated: v.created ? new Date(v.created).toLocaleDateString() : '',
        values: v.values || '',
        raw: versions,
      })
    }
    charts.value = arr
  } catch (error) {
    console.error('Failed to fetch charts', error)
  }
}

const filtered = computed(() => {
  if (!query.value) return charts.value
  const q = query.value.toLowerCase()
  return charts.value.filter((c: any) => c.name.toLowerCase().includes(q) || (c.description||'').toLowerCase().includes(q))
})

const onSearch = (q: string) => { query.value = q }

const detailsVisible = ref(false)
const detailItem = ref<any>({})
const openDetails = (item: any) => {
  detailItem.value = item
  detailsVisible.value = true
}

// initial fetch + polling for real-time updates
let pollId: number | undefined
onMounted(() => {
  fetchCharts()
  pollId = window.setInterval(fetchCharts, 10000)
})

onUnmounted(() => {
  if (pollId) clearInterval(pollId)
})
</script>
