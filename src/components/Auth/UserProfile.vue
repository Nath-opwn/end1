<template>
  <div class="user-profile">
    <div v-if="loading" class="text-center py-4">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center space-x-4">
        <div class="bg-blue-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold">{{ user.username }}</h3>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
      
      <div class="mt-6 border-t pt-4">
        <h4 class="text-lg font-medium mb-2">用户信息</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">用户ID</p>
            <p>{{ user.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">注册时间</p>
            <p>{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button
          @click="handleLogout"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { authApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'UserProfile',
  emits: ['logout'],
  
  setup(props, { emit }) {
    const user = ref({});
    const loading = ref(true);
    const error = ref('');
    
    const fetchUserData = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const userData = await authApi.getCurrentUser();
        user.value = userData;
      } catch (err) {
        console.error('获取用户信息失败:', err);
        error.value = '无法获取用户信息，请重新登录';
      } finally {
        loading.value = false;
      }
    };
    
    const handleLogout = () => {
      authApi.logout();
      emit('logout');
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
    
    onMounted(() => {
      fetchUserData();
    });
    
    return {
      user,
      loading,
      error,
      handleLogout,
      formatDate
    };
  }
};
</script> 