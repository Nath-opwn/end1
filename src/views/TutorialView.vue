<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-blue-800 mb-6">流体动力学教程</h1>
    
    <!-- 教程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 教程卡片 1 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-boat.jpg" 
            alt="船只漂移现象" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=船只漂移教程';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">
            入门级
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">船只漂移现象解析</h3>
          <p class="text-gray-600 mb-4">
            本教程讲解船只为何会在水流中自然转向与水流方向垂直的位置，并通过模拟实验演示这一现象。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              15分钟
            </div>
            <div class="text-sm text-blue-600">互动模拟</div>
          </div>
          <router-link 
            to="/boat-drifting" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </router-link>
        </div>
      </div>
      
      <!-- 教程卡片 2 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-flow.jpg" 
            alt="流体基础" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=流体基础教程';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-medium">
            初级
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">流体动力学基础</h3>
          <p class="text-gray-600 mb-4">
            介绍流体力学的基本概念、方程和定律，包括连续性方程、伯努利原理等，帮助初学者建立良好的理论基础。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30分钟
            </div>
            <div class="text-sm text-green-600">视频讲解</div>
          </div>
          <button 
            @click="showComingSoon" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </button>
        </div>
      </div>
      
      <!-- 教程卡片 3 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-bernoulli.jpg" 
            alt="伯努利演示" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=伯努利原理演示';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-yellow-600 text-white px-3 py-1 text-xs font-medium">
            中级
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">伯努利原理演示实验</h3>
          <p class="text-gray-600 mb-4">
            通过交互式实验演示伯努利原理，探索流速、压力与高度之间的关系，以及在工程中的实际应用。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              25分钟
            </div>
            <div class="text-sm text-yellow-600">实验演示</div>
          </div>
          <button 
            @click="showComingSoon" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </button>
        </div>
      </div>
      
      <!-- 教程卡片 4 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-reynolds.jpg" 
            alt="雷诺实验" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=雷诺实验';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-xs font-medium">
            高级
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">雷诺实验与流态转换</h3>
          <p class="text-gray-600 mb-4">
            深入探讨雷诺数及其对流动状态的影响，通过虚拟实验观察层流向湍流的转换过程及其物理机制。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              40分钟
            </div>
            <div class="text-sm text-red-600">高级模拟</div>
          </div>
          <button 
            @click="showComingSoon" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </button>
        </div>
      </div>
      
      <!-- 教程卡片 5 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-cfd.jpg" 
            alt="CFD入门" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=CFD入门';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-medium">
            专业
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">计算流体力学入门</h3>
          <p class="text-gray-600 mb-4">
            介绍CFD的基本概念、流程和方法，以简单算例讲解如何使用数值方法求解流体力学问题。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              60分钟
            </div>
            <div class="text-sm text-purple-600">专业课程</div>
          </div>
          <button 
            @click="showComingSoon" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </button>
        </div>
      </div>
      
      <!-- 教程卡片 6 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img 
            src="../assets/tutorial-boundary.jpg" 
            alt="边界层理论" 
            class="w-full h-48 object-cover"
            onerror="this.src='https://placehold.co/800x400/e0f2fe/0369a1?text=边界层理论';this.onerror='';"
          />
          <div class="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-xs font-medium">
            高级
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2">边界层理论与应用</h3>
          <p class="text-gray-600 mb-4">
            深入讲解边界层理论、特性及其在工程应用中的重要性，包括边界层分离与控制技术。
          </p>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              45分钟
            </div>
            <div class="text-sm text-red-600">高级模拟</div>
          </div>
          <button 
            @click="showComingSoon" 
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            开始教程
          </button>
        </div>
      </div>
    </div>
    
    <!-- 学习路径 -->
    <div class="mt-12 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-blue-800 mb-4">推荐学习路径</h2>
      <div class="relative">
        <!-- 路径连接线 -->
        <div class="absolute left-4 top-2 w-1 bg-blue-200 h-[calc(100%-16px)]"></div>
        
        <!-- 学习步骤 -->
        <div class="space-y-8">
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">1</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">流体动力学基础</h3>
              <p class="text-gray-600">学习基本概念、方程和定律，建立理论基础</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">2</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">伯努利原理演示实验</h3>
              <p class="text-gray-600">通过实验理解伯努利原理及其应用</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">3</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">船只漂移现象解析</h3>
              <p class="text-gray-600">将理论知识应用到具体的流体现象解释</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">4</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">雷诺实验与流态转换</h3>
              <p class="text-gray-600">深入理解流体流动状态及其转换机制</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">5</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">边界层理论与应用</h3>
              <p class="text-gray-600">学习边界层理论及其在工程中的应用</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="relative flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full z-10">
              <span class="text-white text-sm">6</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-800">计算流体力学入门</h3>
              <p class="text-gray-600">掌握CFD方法，解决复杂的流体力学问题</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 功能实现中提示
const showComingSoon = () => {
  alert('此功能正在开发中，敬请期待！');
};
</script> 