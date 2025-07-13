<template>
  <div class="simulation-session-form">
    <h2 class="text-2xl font-bold mb-6">创建模拟会话</h2>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">会话名称</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入会话名称"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">会话描述</label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入会话描述"
          required
        ></textarea>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-2">模拟参数</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="reynoldsNumber" class="block text-sm font-medium text-gray-700 mb-1">雷诺数</label>
            <input
              id="reynoldsNumber"
              v-model.number="params.reynoldsNumber"
              type="number"
              min="0"
              step="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="viscosity" class="block text-sm font-medium text-gray-700 mb-1">粘度</label>
            <input
              id="viscosity"
              v-model.number="params.viscosity"
              type="number"
              min="0.001"
              step="0.001"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="density" class="block text-sm font-medium text-gray-700 mb-1">密度</label>
            <input
              id="density"
              v-model.number="params.density"
              type="number"
              min="0.1"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="gridSize" class="block text-sm font-medium text-gray-700 mb-1">网格尺寸</label>
            <div class="flex space-x-2">
              <input
                id="gridSizeX"
                v-model.number="params.gridSize.x"
                type="number"
                min="10"
                step="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="X"
              />
              <input
                id="gridSizeY"
                v-model.number="params.gridSize.y"
                type="number"
                min="10"
                step="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Y"
              />
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <label for="simulationType" class="block text-sm font-medium text-gray-700 mb-1">模拟类型</label>
          <select
            id="simulationType"
            v-model="params.simulationType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cylinder">圆柱体绕流</option>
            <option value="tunnel">通道流</option>
            <option value="karman">卡门涡街</option>
            <option value="custom">自定义</option>
          </select>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button
          type="button"
          class="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="$emit('cancel')"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="loading"
        >
          {{ loading ? '创建中...' : '创建会话' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { simulationApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'SimulationSessionForm',
  emits: ['created', 'cancel'],
  
  setup(props, { emit }) {
    const name = ref('');
    const description = ref('');
    const params = ref({
      reynoldsNumber: 1000,
      viscosity: 0.01,
      density: 1.0,
      gridSize: {
        x: 100,
        y: 50
      },
      simulationType: 'cylinder'
    });
    const loading = ref(false);
    const error = ref('');
    
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await simulationApi.createSession(name.value, description.value, params.value);
        
        // 创建成功
        emit('created', response);
      } catch (err) {
        console.error('创建模拟会话失败:', err);
        error.value = '创建模拟会话失败，请稍后重试';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      name,
      description,
      params,
      loading,
      error,
      handleSubmit
    };
  }
};
</script> 