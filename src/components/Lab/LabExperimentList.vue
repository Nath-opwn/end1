<template>
  <div class="experiment-list-container">
    <h2 class="text-xl font-semibold mb-4">流体力学实验室</h2>
    
    <!-- 实验分类选择 -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id"
          class="px-4 py-2 rounded-full transition-colors"
          :class="selectedCategory === category.id ? 
            'bg-blue-600 text-white' : 
            'bg-blue-100 text-blue-800 hover:bg-blue-200'"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
    
    <!-- 实验卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="experiment in filteredExperiments" 
        :key="experiment.type"
        class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
        @click="selectExperiment(experiment)"
      >
        <div class="h-40 bg-blue-900 relative">
          <img :src="getExperimentImage(experiment.type)" alt="实验图片" class="w-full h-full object-cover opacity-80">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent p-3">
            <h3 class="text-lg font-medium text-white">{{ experiment.name }}</h3>
          </div>
        </div>
        
        <div class="p-4">
          <p class="text-gray-600 text-sm line-clamp-2">{{ experiment.description }}</p>
          
          <div class="mt-3 flex justify-between items-center">
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {{ getCategoryNameById(getExperimentCategory(experiment.type)) }}
            </span>
            
            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无实验数据时显示 -->
    <div v-if="filteredExperiments.length === 0" class="text-center py-8">
      <div class="text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p class="text-lg">暂无符合条件的实验</p>
        <p class="mt-2">请尝试选择其他分类或联系管理员</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import labService, { LabExperimentType } from '../../services/labService';

// 实验分类
const categories = [
  { id: 'all', name: '全部实验' },
  { id: 'static', name: '静力学实验' },
  { id: 'flow', name: '流动特性实验' },
  { id: 'resistance', name: '流动阻力实验' },
  { id: 'momentum', name: '动量定律实验' },
  { id: 'comprehensive', name: '综合应用实验' },
  { id: 'demo', name: '演示类实验' }
];

const selectedCategory = ref('all');
const experiments = ref([]);
const loading = ref(true);
const error = ref(null);

// 根据分类筛选实验
const filteredExperiments = computed(() => {
  if (selectedCategory.value === 'all') {
    return experiments.value;
  }
  return experiments.value.filter(exp => 
    getExperimentCategory(exp.type) === selectedCategory.value
  );
});

// 获取实验分类
function getExperimentCategory(type) {
  const categoryMap = {
    [LabExperimentType.STATIC_PRESSURE]: 'static',
    [LabExperimentType.FLUID_STATICS]: 'static',
    [LabExperimentType.REYNOLDS]: 'flow',
    [LabExperimentType.BERNOULLI]: 'flow',
    [LabExperimentType.VENTURI]: 'flow',
    [LabExperimentType.FRICTION_LOSS]: 'resistance',
    [LabExperimentType.LOCAL_LOSS]: 'resistance',
    [LabExperimentType.MOMENTUM]: 'momentum',
    [LabExperimentType.KARMAN_VORTEX]: 'momentum',
    [LabExperimentType.BOUNDARY_LAYER]: 'comprehensive',
    [LabExperimentType.HYDRAULIC_JUMP]: 'comprehensive',
    [LabExperimentType.CYLINDER_PRESSURE]: 'comprehensive',
    [LabExperimentType.BERNOULLI_LEVITATOR]: 'demo',
    [LabExperimentType.HYPERELASTIC]: 'demo'
  };
  
  return categoryMap[type] || 'all';
}

// 获取分类名称
function getCategoryNameById(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : '未分类';
}

// 获取实验图片
function getExperimentImage(type) {
  const imageMap = {
    [LabExperimentType.STATIC_PRESSURE]: '/images/experiments/static_pressure.jpg',
    [LabExperimentType.FLUID_STATICS]: '/images/experiments/fluid_statics.jpg',
    [LabExperimentType.REYNOLDS]: '/images/experiments/reynolds.jpg',
    [LabExperimentType.BERNOULLI]: '/images/experiments/bernoulli.jpg',
    [LabExperimentType.VENTURI]: '/images/experiments/venturi.jpg',
    [LabExperimentType.FRICTION_LOSS]: '/images/experiments/friction_loss.jpg',
    [LabExperimentType.LOCAL_LOSS]: '/images/experiments/local_loss.jpg',
    [LabExperimentType.MOMENTUM]: '/images/experiments/momentum.jpg',
    [LabExperimentType.KARMAN_VORTEX]: '/images/experiments/karman_vortex.jpg',
    [LabExperimentType.BOUNDARY_LAYER]: '/images/experiments/boundary_layer.jpg',
    [LabExperimentType.HYDRAULIC_JUMP]: '/images/experiments/hydraulic_jump.jpg',
    [LabExperimentType.CYLINDER_PRESSURE]: '/images/experiments/cylinder_pressure.jpg',
    [LabExperimentType.BERNOULLI_LEVITATOR]: '/images/experiments/bernoulli_levitator.jpg',
    [LabExperimentType.HYPERELASTIC]: '/images/experiments/hyperelastic.jpg'
  };
  
  return imageMap[type] || '/images/experiments/default.jpg';
}

// 选择实验
function selectExperiment(experiment) {
  // 触发实验选择事件
  emit('experiment-selected', experiment);
}

// 定义要向父组件发出的事件
const emit = defineEmits(['experiment-selected']);

// 获取实验列表
async function fetchExperiments() {
  try {
    loading.value = true;
    experiments.value = await labService.getAvailableExperiments();
  } catch (err) {
    console.error('Failed to fetch experiments:', err);
    error.value = '获取实验列表失败';
    // 使用模拟数据作为后备
    experiments.value = getMockExperiments();
  } finally {
    loading.value = false;
  }
}

// 模拟数据（后端API未准备好时使用）
function getMockExperiments() {
  return [
    {
      type: LabExperimentType.STATIC_PRESSURE,
      name: '静水压强实验',
      description: '验证流体静力学基本方程，测量静止液体内部压强分布。'
    },
    {
      type: LabExperimentType.FLUID_STATICS,
      name: '流体静力学综合实验',
      description: '包括测压管水头线测量、液体容重测定等。'
    },
    {
      type: LabExperimentType.REYNOLDS,
      name: '雷诺实验',
      description: '观察层流与湍流流态，测定临界雷诺数。'
    },
    {
      type: LabExperimentType.BERNOULLI,
      name: '伯努利方程验证实验',
      description: '验证总水头线与测压管水头线的关系，分析动能与势能转化。'
    },
    {
      type: LabExperimentType.VENTURI,
      name: '文丘里流量计实验',
      description: '测定流量系数，验证气-水多管压差计原理。'
    },
    {
      type: LabExperimentType.FRICTION_LOSS,
      name: '沿程阻力实验',
      description: '测定沿程水头损失系数，绘制λ-Re关系曲线。'
    },
    {
      type: LabExperimentType.LOCAL_LOSS,
      name: '局部阻力实验',
      description: '测量突扩管或阀门处的局部水头损失及阻力系数。'
    },
    {
      type: LabExperimentType.MOMENTUM,
      name: '动量定律实验',
      description: '验证不可压缩流体恒定流动量方程，分析射流冲击力。'
    },
    {
      type: LabExperimentType.KARMAN_VORTEX,
      name: '卡门涡街实验',
      description: '观察圆柱绕流中周期性涡旋脱落现象。'
    },
    {
      type: LabExperimentType.BOUNDARY_LAYER,
      name: '平板边界层速度剖面测量',
      description: '通过热线风速仪测量边界层速度分布。'
    },
    {
      type: LabExperimentType.HYDRAULIC_JUMP,
      name: '水跃综合实验',
      description: '验证平坡矩形明槽自由水跃共轭水深理论。'
    },
    {
      type: LabExperimentType.CYLINDER_PRESSURE,
      name: '圆柱绕流表面压力分布实验',
      description: '用多管压力计测量圆柱表面压强分布。'
    },
    {
      type: LabExperimentType.BERNOULLI_LEVITATOR,
      name: '伯努利悬浮器实验',
      description: '直观展示流速与压强的关系（如飞机机翼升力原理）。'
    },
    {
      type: LabExperimentType.HYPERELASTIC,
      name: '超弹性现象演示',
      description: '观察材料在冲击下的形变与恢复特性。'
    }
  ];
}

// 组件挂载时获取数据
onMounted(() => {
  fetchExperiments();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style> 