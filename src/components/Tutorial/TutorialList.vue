<template>
  <div class="tutorial-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">教程列表</h2>
      <div class="flex space-x-3">
        <div class="relative">
          <select
            v-model="selectedDifficulty"
            class="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">所有难度</option>
            <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
              {{ getDifficultyText(difficulty) }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute right-2 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button
          v-if="isAdmin"
          @click="$emit('create-new')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          创建新教程
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else-if="tutorials.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p class="text-gray-600 mb-4">没有找到相关教程</p>
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tutorial in tutorials"
        :key="tutorial.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-semibold">{{ tutorial.title }}</h3>
            <span :class="getDifficultyClass(tutorial.difficulty)">
              {{ getDifficultyText(tutorial.difficulty) }}
            </span>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-3">{{ tutorial.description }}</p>
          
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">{{ formatDate(tutorial.created_at) }}</span>
            <button
              @click="$emit('view-tutorial', tutorial)"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="tutorials.length > 0 && hasMore" class="mt-6 text-center">
      <button
        @click="loadMore"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="loadingMore"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { tutorialApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'TutorialList',
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['create-new', 'view-tutorial'],
  
  setup() {
    const tutorials = ref([]);
    const difficulties = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const error = ref('');
    const offset = ref(0);
    const limit = ref(9);
    const hasMore = ref(true);
    const selectedDifficulty = ref('');
    
    const fetchDifficulties = async () => {
      try {
        const response = await tutorialApi.getDifficulties();
        difficulties.value = response;
      } catch (err) {
        console.error('获取难度级别失败:', err);
      }
    };
    
    const fetchTutorials = async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          loadingMore.value = true;
        } else {
          loading.value = true;
          offset.value = 0;
        }
        
        error.value = '';
        
        const response = await tutorialApi.getTutorials(
          selectedDifficulty.value || null,
          limit.value,
          offset.value
        );
        
        if (isLoadMore) {
          tutorials.value = [...tutorials.value, ...response.items];
        } else {
          tutorials.value = response.items;
        }
        
        // 更新分页信息
        hasMore.value = response.items.length === limit.value;
        if (hasMore.value) {
          offset.value += limit.value;
        }
      } catch (err) {
        console.error('获取教程列表失败:', err);
        error.value = '获取教程列表失败，请稍后重试';
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };
    
    const loadMore = () => {
      fetchTutorials(true);
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    const getDifficultyText = (difficulty) => {
      switch (difficulty) {
        case 'beginner':
          return '初级';
        case 'intermediate':
          return '中级';
        case 'advanced':
          return '高级';
        case 'expert':
          return '专家';
        default:
          return difficulty;
      }
    };
    
    const getDifficultyClass = (difficulty) => {
      const baseClass = 'text-xs px-2 py-1 rounded';
      
      switch (difficulty) {
        case 'beginner':
          return `${baseClass} bg-green-100 text-green-800`;
        case 'intermediate':
          return `${baseClass} bg-blue-100 text-blue-800`;
        case 'advanced':
          return `${baseClass} bg-orange-100 text-orange-800`;
        case 'expert':
          return `${baseClass} bg-red-100 text-red-800`;
        default:
          return `${baseClass} bg-gray-100 text-gray-800`;
      }
    };
    
    watch(selectedDifficulty, () => {
      fetchTutorials();
    });
    
    onMounted(() => {
      fetchDifficulties();
      fetchTutorials();
    });
    
    return {
      tutorials,
      difficulties,
      loading,
      loadingMore,
      error,
      hasMore,
      selectedDifficulty,
      loadMore,
      formatDate,
      getDifficultyText,
      getDifficultyClass
    };
  }
};
</script> 