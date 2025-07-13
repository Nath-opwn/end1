<template>
  <div class="simulation-session-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">模拟会话列表</h2>
      <button
        @click="$emit('create-new')"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        创建新会话
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else-if="sessions.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-600 mb-4">您还没有创建任何模拟会话</p>
      <button
        @click="$emit('create-new')"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        创建第一个会话
      </button>
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">{{ session.name }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-2">{{ session.description }}</p>
          
          <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>创建时间: {{ formatDate(session.created_at) }}</span>
            <span>ID: {{ session.id.substring(0, 8) }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span :class="getStatusClass(session.status)">
              {{ getStatusText(session.status) }}
            </span>
            <button
              @click="$emit('view-session', session)"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="sessions.length > 0 && hasMore" class="mt-6 text-center">
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
import { ref, onMounted } from 'vue';
import { simulationApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'SimulationSessionList',
  emits: ['create-new', 'view-session'],
  
  setup() {
    const sessions = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const error = ref('');
    const offset = ref(0);
    const limit = ref(10);
    const hasMore = ref(true);
    
    const fetchSessions = async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          loadingMore.value = true;
        } else {
          loading.value = true;
          offset.value = 0;
        }
        
        error.value = '';
        
        const response = await simulationApi.getSessions(null, limit.value, offset.value);
        
        if (isLoadMore) {
          sessions.value = [...sessions.value, ...response.items];
        } else {
          sessions.value = response.items;
        }
        
        // 更新分页信息
        hasMore.value = response.items.length === limit.value;
        if (hasMore.value) {
          offset.value += limit.value;
        }
      } catch (err) {
        console.error('获取模拟会话列表失败:', err);
        error.value = '获取模拟会话列表失败，请稍后重试';
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };
    
    const loadMore = () => {
      fetchSessions(true);
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
    
    const getStatusClass = (status) => {
      switch (status) {
        case 'active':
          return 'text-green-600 font-medium';
        case 'completed':
          return 'text-blue-600 font-medium';
        case 'error':
          return 'text-red-600 font-medium';
        default:
          return 'text-gray-600';
      }
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'active':
          return '进行中';
        case 'completed':
          return '已完成';
        case 'error':
          return '错误';
        default:
          return '未知状态';
      }
    };
    
    onMounted(() => {
      fetchSessions();
    });
    
    return {
      sessions,
      loading,
      loadingMore,
      error,
      hasMore,
      loadMore,
      formatDate,
      getStatusClass,
      getStatusText
    };
  }
};
</script> 