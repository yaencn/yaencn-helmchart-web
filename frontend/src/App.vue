<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-blue-600">Yaencn HelmChart</h1>
        </div>
        <nav class="flex space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-blue-600">首页</router-link>
          <router-link to="/admin" class="text-gray-600 hover:text-blue-600">管理后台</router-link>
        </nav>
      </div>
    </header>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-white border-t py-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500">
        <p>© 2025 雅恩 HelmChart 仓库。保留所有权利。</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
