<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-blue-800">流体动力学模拟系统</h2>
        <p class="text-gray-600 mt-2">创建新账户</p>
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请创建用户名"
            required
          >
        </div>
        
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">电子邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入电子邮箱"
            required
          >
        </div>
        
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请设置密码"
            required
          >
        </div>
        
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请再次输入密码"
            required
          >
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          :disabled="isLoading"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          已有账户？
          <router-link to="/" class="text-blue-600 hover:underline">登录</router-link>
        </p>
      </div>
      
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = () => {
  // 清除之前的消息
  errorMessage.value = '';
  successMessage.value = '';
  
  // 基本验证
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }
  
  isLoading.value = true;
  
  // 模拟注册过程
  setTimeout(() => {
    // 在实际项目中，这里会调用API进行注册
    successMessage.value = '注册成功！即将跳转到登录页面...';
    
    // 延迟跳转到登录页
    setTimeout(() => {
      router.push('/');
    }, 2000);
    
    isLoading.value = false;
  }, 1500);
};
</script> 