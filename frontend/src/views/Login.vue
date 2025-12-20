<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">登录管理后台</h2>
      </div>
      <el-form :model="loginForm" class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>
        <div>
          <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('username', loginForm.username)
    params.append('password', loginForm.password)

    const response = await axios.post('/api/v1/login/access-token', params)
    authStore.setToken(response.data.access_token)
    // set default Authorization header for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
    
    // Get user info
    const userResponse = await axios.get('/api/v1/login/test-token', {
      headers: { Authorization: `Bearer ${response.data.access_token}` }
    })
    authStore.setUser(userResponse.data)
    
    ElMessage.success('登录成功')
    router.push('/admin')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>
