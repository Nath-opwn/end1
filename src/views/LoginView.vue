<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-blue-800">流体动力学模拟系统</h2>
        <p class="text-gray-600 mt-2">请登录您的账户</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-medium mb-2">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入密码"
            required
          >
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          没有账户？
          <router-link to="/register" class="text-blue-600 hover:underline">注册</router-link>
        </p>
      </div>
      
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  // 模拟登录操作
  setTimeout(() => {
    // 在实际项目中，应该调用API进行身份验证
    if (username.value === 'demo' && password.value === 'demo') {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true');
      
      // 跳转到首页
      router.push('/home');
    } else {
      errorMessage.value = '用户名或密码错误';
    }
    
    isLoading.value = false;
  }, 1000);
};
</script> 