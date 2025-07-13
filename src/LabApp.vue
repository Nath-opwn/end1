<template>
  <div class="lab-app">
    <header class="bg-blue-800 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <img alt="流体动力学" class="h-10 w-auto mr-4" src="./assets/logo.svg" />
          <h1 class="text-xl font-bold">流体力学实验室</h1>
        </div>
      </div>
    </header>

    <main class="flex-grow overflow-auto">
      <LabView />
    </main>
  </div>
</template>

<script setup>
import LabView from './views/LabView.vue';
</script>

<style>
@import './assets/base.css';

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.lab-app {
  height: 100vh;
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
</style> 