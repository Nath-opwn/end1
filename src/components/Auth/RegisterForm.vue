<template>
  <div class="register-form">
    <h2 class="text-2xl font-bold mb-6 text-center">用户注册</h2>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleRegister">
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
      
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-6">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">两次输入的密码不一致</p>
      </div>
      
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="loading || passwordMismatch"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          已有账号？
          <a href="#" @click.prevent="$emit('switch-to-login')" class="text-blue-600 hover:underline">登录</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { authApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'RegisterForm',
  emits: ['register-success', 'switch-to-login'],
  
  setup(props, { emit }) {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const error = ref('');
    
    const passwordMismatch = computed(() => {
      return password.value && confirmPassword.value && password.value !== confirmPassword.value;
    });
    
    const handleRegister = async () => {
      if (passwordMismatch.value) {
        return;
      }
      
      try {
        loading.value = true;
        error.value = '';
        
        const response = await authApi.register(username.value, email.value, password.value);
        
        // 注册成功
        emit('register-success', response);
      } catch (err) {
        console.error('注册失败:', err);
        error.value = '注册失败，请检查您的信息或稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      username,
      email,
      password,
      confirmPassword,
      loading,
      error,
      passwordMismatch,
      handleRegister
    };
  }
};
</script> 