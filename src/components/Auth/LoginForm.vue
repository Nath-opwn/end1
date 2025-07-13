<template>
  <div class="login-form">
    <h2 class="text-2xl font-bold mb-6 text-center">用户登录</h2>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          还没有账号？
          <a href="#" @click.prevent="$emit('switch-to-register')" class="text-blue-600 hover:underline">注册</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { authApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'LoginForm',
  emits: ['login-success', 'switch-to-register'],
  
  setup(props, { emit }) {
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    
    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await authApi.login(username.value, password.value);
        
        // 登录成功
        emit('login-success', response);
      } catch (err) {
        console.error('登录失败:', err);
        error.value = '用户名或密码错误，请重试';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      username,
      password,
      loading,
      error,
      handleLogin
    };
  }
};
</script> 