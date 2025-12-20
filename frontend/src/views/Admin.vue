<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Chart 管理后台</h2>
      <el-button type="primary" @click="uploadDialogVisible = true">上传新 Chart</el-button>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="group in chartGroups"
        :key="group.name"
        :title="group.name + ' (' + group.versions.length + ')'"
      >
        <el-table :data="group.versions" style="width: 100%" v-loading="loading">
          <el-table-column prop="version" label="版本" width="120" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="updated" label="更新时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <!-- Upload Dialog -->
    <el-dialog v-model="uploadDialogVisible" title="上传 Chart (.tgz)" width="400px">
      <el-upload
        class="upload-demo"
        drag
        action="/api/v1/charts/upload"
        :headers="uploadHeaders"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        accept=".tgz"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../store/auth'
import { UploadFilled } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const chartGroups = ref<any[]>([])
const loading = ref(false)
const uploadDialogVisible = ref(false)
const activeNames = ref<string[]>([])

const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.token}`
}))

const fetchCharts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/v1/charts/list')
    const entries = response.data.entries || {}
    const groups: Record<string, any[]> = {}
    for (const [name, versions] of Object.entries(entries)) {
      groups[name] = (versions as any[]).map((v: any) => ({
        name,
        version: v.version || '',
        description: v.description || '',
        updated: v.created ? new Date(v.created).toLocaleString() : '',
        filename: v.urls && v.urls.length ? v.urls[0] : `${name}-${v.version}.tgz`
      }))
    }
    // Convert to array and keep order
    chartGroups.value = Object.keys(groups).sort().map(name => ({ name, versions: groups[name] }))
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除 ${row.name} (${row.version}) 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await axios.delete(`/api/v1/charts/${row.filename}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      ElMessage.success('删除成功')
      fetchCharts()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  uploadDialogVisible.value = false
  fetchCharts()
}

const handleUploadError = (err: any) => {
  const msg = JSON.parse(err.message || '{}').detail || '上传失败'
  ElMessage.error(msg)
}

onMounted(fetchCharts)
</script>
