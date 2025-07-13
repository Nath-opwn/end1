<template>
  <div class="auth-container max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <LoginForm 
      v-if="activeForm === 'login'" 
      @login-success="handleLoginSuccess" 
      @switch-to-register="activeForm = 'register'" 
    />
    <RegisterForm 
      v-else 
      @register-success="handleRegisterSuccess" 
      @switch-to-login="activeForm = 'login'" 
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

export default {
  name: 'AuthContainer',
  components: {
    LoginForm,
    RegisterForm
  },
  emits: ['auth-success'],
  
  setup(props, { emit }) {
    const activeForm = ref('login'); // 'login' 或 'register'
    
    const handleLoginSuccess = (userData) => {
      emit('auth-success', userData);
    };
    
    const handleRegisterSuccess = () => {
      // 注册成功后切换到登录表单
      activeForm.value = 'login';
    };
    
    return {
      activeForm,
      handleLoginSuccess,
      handleRegisterSuccess
    };
  }
};
</script> 