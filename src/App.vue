<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-blue-800 text-white shadow-md sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <img alt="流体动力学" class="h-10 w-auto mr-4" src="./assets/logo.svg" />
          <h1 class="text-xl font-bold">流体动力学模拟系统</h1>
        </div>
        
        <nav class="flex space-x-6">
          <RouterLink to="/home" class="hover:text-blue-200 transition-colors py-1 px-2">首页</RouterLink>
          <RouterLink to="/simulation" class="hover:text-blue-200 transition-colors py-1 px-2">模拟</RouterLink>
          <RouterLink to="/boat-drifting" class="hover:text-blue-200 transition-colors py-1 px-2">船只漂移演示</RouterLink>
          <RouterLink to="/lab" class="hover:text-blue-200 transition-colors py-1 px-2">实验室</RouterLink>
          <RouterLink to="/knowledge" class="hover:text-blue-200 transition-colors py-1 px-2">知识库</RouterLink>
          <RouterLink to="/tutorial" class="hover:text-blue-200 transition-colors py-1 px-2">教程</RouterLink>
        </nav>
    </div>
  </header>

    <main class="flex-grow overflow-auto">
      <RouterView />
  </main>
  </div>
</template>

<style>
@import './assets/base.css';

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  height: 100%;
    display: flex;
  flex-direction: column;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
  color: #1f2937;
}

.router-link-active {
  color: #93c5fd;
  font-weight: 500;
}
</style>
