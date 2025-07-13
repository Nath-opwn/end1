<template>
  <div class="container mx-auto px-4 py-8">
    <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 class="text-2xl font-bold text-blue-800 mb-4">欢迎使用流体动力学模拟系统</h1>
      <p class="text-gray-700 mb-4">
        本系统提供了专业的流体动力学模拟环境，可以帮助您理解和分析各种流体现象。
        通过直观的可视化界面和精确的数值计算，您可以探索流体力学领域的多种现象和应用。
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 class="font-medium text-blue-800">实时模拟</h3>
          <p class="text-sm text-gray-600 mt-2">使用先进的计算流体动力学算法，提供高精度的流体行为模拟</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 class="font-medium text-blue-800">可视化分析</h3>
          <p class="text-sm text-gray-600 mt-2">通过多种可视化工具，直观展示流体流动、压力分布等物理量</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 class="font-medium text-blue-800">互动教学</h3>
          <p class="text-sm text-gray-600 mt-2">提供丰富的教程和知识库，帮助理解复杂的流体动力学概念</p>
        </div>
      </div>
    </section>
    
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-700 text-white p-4">
          <h2 class="text-xl font-bold">推荐模拟</h2>
        </div>
        <div class="p-6">
          <ul class="space-y-4">
            <li>
              <router-link to="/boat-drifting" class="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-blue-800">船只漂移现象</h3>
                  <p class="text-sm text-gray-600">探索船只在流体中的稳定性和漂移机理</p>
                </div>
              </router-link>
            </li>
            <li>
              <router-link to="/simulation" class="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-blue-800">自定义模拟</h3>
                  <p class="text-sm text-gray-600">创建和配置您自己的流体动力学模拟场景</p>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-700 text-white p-4">
          <h2 class="text-xl font-bold">实验室</h2>
        </div>
        <div class="p-6">
          <router-link to="/lab" class="block mb-6">
            <img src="../assets/lab-preview.png" alt="实验室预览" class="w-full h-48 object-cover rounded-lg mb-3" onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=流体动力学实验室';this.onerror='';" />
            <h3 class="font-medium text-blue-800 mb-2">流体动力学虚拟实验室</h3>
            <p class="text-sm text-gray-600">体验虚拟实验环境，进行各种流体动力学实验</p>
          </router-link>
          <router-link to="/lab" class="inline-flex items-center text-blue-600 hover:text-blue-800">
            进入实验室
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 首页逻辑
</script> 