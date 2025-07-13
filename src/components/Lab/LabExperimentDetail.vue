<template>
  <div class="experiment-detail">
    <!-- 实验头部 -->
    <div class="mb-6 pb-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ experimentData?.name }}</h2>
          <p class="text-gray-600 mt-1">{{ experimentData?.description }}</p>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="goBack"
            class="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            返回列表
          </button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧参数面板 -->
      <div class="md:col-span-1 bg-white rounded-lg shadow-md p-5">
        <h3 class="text-lg font-medium mb-4">实验参数配置</h3>
        
        <div v-if="loading" class="py-4 text-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载参数配置中...
        </div>
        
        <div v-else-if="error" class="py-4 text-center text-red-500">
          {{ error }}
        </div>
        
        <div v-else class="space-y-4">
          <!-- 参数表单 -->
          <div v-for="param in configuration?.parameters" :key="param.name" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ param.name }}
            </label>
            
            <!-- 数字输入框 -->
            <div v-if="param.type === 'number'" class="flex items-center">
              <input 
                type="range" 
                v-model.number="parameters[param.name]" 
                :min="param.range?.[0]" 
                :max="param.range?.[1]"
                :step="param.step || 0.01"
                class="w-full mr-2"
              />
              <input 
                type="number" 
                v-model.number="parameters[param.name]"
                :min="param.range?.[0]" 
                :max="param.range?.[1]"
                :step="param.step || 0.01"
                class="w-16 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            
            <!-- 选择框 -->
            <select 
              v-else-if="param.type === 'select'"
              v-model="parameters[param.name]"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="option in param.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            
            <!-- 开关 -->
            <div v-else-if="param.type === 'boolean'" class="flex items-center">
              <input 
                type="checkbox" 
                :id="`param-${param.name}`" 
                v-model="parameters[param.name]"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <label :for="`param-${param.name}`" class="ml-2 text-sm text-gray-600">
                {{ parameters[param.name] ? '开启' : '关闭' }}
              </label>
            </div>
            
            <!-- 文本输入 -->
            <input 
              v-else
              type="text"
              v-model="parameters[param.name]"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="pt-4 border-t border-gray-200 mt-6">
            <button 
              @click="runExperiment"
              :disabled="experimentRunning"
              class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="{ 'opacity-50 cursor-not-allowed': experimentRunning }"
            >
              {{ experimentRunning ? '实验运行中...' : '开始实验' }}
            </button>
            
            <div v-if="experimentRunning" class="mt-4">
              <div class="relative pt-1">
                <div class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200">
                  <div :style="`width:${progress}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"></div>
                </div>
                <div class="text-right text-xs text-blue-600">{{ progress }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧结果区域 -->
      <div class="md:col-span-2">
        <!-- 实验未开始状态 -->
        <div v-if="!experimentStarted && !experimentRunning" class="bg-white rounded-lg shadow-md h-96 flex items-center justify-center">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 class="text-xl font-medium text-gray-800 mb-2">实验准备就绪</h3>
            <p class="text-gray-600">请配置左侧参数并点击"开始实验"按钮</p>
          </div>
        </div>
        
        <!-- 实验运行中状态 -->
        <div v-else-if="experimentRunning" class="bg-white rounded-lg shadow-md h-96 flex items-center justify-center">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 mx-auto text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 class="text-xl font-medium text-gray-800 mb-2">实验计算中</h3>
            <p class="text-gray-600">后端物理引擎正在进行模拟计算</p>
            <p class="text-sm text-gray-500 mt-2">预计需要10-30秒完成</p>
          </div>
        </div>
        
        <!-- 实验结果展示 -->
        <div v-else-if="experimentResults" class="space-y-4">
          <!-- 结果可视化区域 -->
          <div class="bg-white rounded-lg shadow-md p-4 h-96">
            <div ref="visualizationContainer" class="h-full"></div>
          </div>
          
          <!-- 结果数据表格 -->
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-medium mb-3">实验结果数据</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th v-for="(value, key) in firstDataRow" :key="key" class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ key }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in experimentResults.results.data" :key="index">
                    <td v-for="(value, key) in row" :key="key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ typeof value === 'number' ? value.toFixed(4) : value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import labService, { LabExperimentType } from '../../services/labService';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

const props = defineProps({
  experimentType: {
    type: String,
    required: true
  }
});

// 路由函数
const emit = defineEmits(['go-back']);

const goBack = () => {
  emit('go-back');
};

// 状态变量
const loading = ref(false);
const error = ref(null);
const configuration = ref(null);
const parameters = reactive({});
const experimentSession = ref(null);
const experimentRunning = ref(false);
const experimentStarted = ref(false);
const experimentResults = ref(null);
const progress = ref(0);
const visualizationContainer = ref(null);
const pollingInterval = ref(null);

// 计算属性
const experimentData = computed(() => {
  // 实验信息映射
  const experimentMap = {
    [LabExperimentType.STATIC_PRESSURE]: {
      name: '静水压强实验',
      description: '验证流体静力学基本方程，测量静止液体内部压强分布。'
    },
    [LabExperimentType.FLUID_STATICS]: {
      name: '流体静力学综合实验',
      description: '包括测压管水头线测量、液体容重测定等。'
    },
    [LabExperimentType.REYNOLDS]: {
      name: '雷诺实验',
      description: '观察层流与湍流流态，测定临界雷诺数。'
    },
    [LabExperimentType.BERNOULLI]: {
      name: '伯努利方程验证实验',
      description: '验证总水头线与测压管水头线的关系，分析动能与势能转化。'
    },
    [LabExperimentType.VENTURI]: {
      name: '文丘里流量计实验',
      description: '测定流量系数，验证气-水多管压差计原理。'
    },
    [LabExperimentType.FRICTION_LOSS]: {
      name: '沿程阻力实验',
      description: '测定沿程水头损失系数，绘制λ-Re关系曲线。'
    },
    [LabExperimentType.LOCAL_LOSS]: {
      name: '局部阻力实验',
      description: '测量突扩管或阀门处的局部水头损失及阻力系数。'
    },
    [LabExperimentType.MOMENTUM]: {
      name: '动量定律实验',
      description: '验证不可压缩流体恒定流动量方程，分析射流冲击力。'
    },
    [LabExperimentType.KARMAN_VORTEX]: {
      name: '卡门涡街实验',
      description: '观察圆柱绕流中周期性涡旋脱落现象。'
    },
    [LabExperimentType.BOUNDARY_LAYER]: {
      name: '平板边界层速度剖面测量',
      description: '通过热线风速仪测量边界层速度分布。'
    },
    [LabExperimentType.HYDRAULIC_JUMP]: {
      name: '水跃综合实验',
      description: '验证平坡矩形明槽自由水跃共轭水深理论。'
    },
    [LabExperimentType.CYLINDER_PRESSURE]: {
      name: '圆柱绕流表面压力分布实验',
      description: '用多管压力计测量圆柱表面压强分布。'
    },
    [LabExperimentType.BERNOULLI_LEVITATOR]: {
      name: '伯努利悬浮器实验',
      description: '直观展示流速与压强的关系（如飞机机翼升力原理）。'
    },
    [LabExperimentType.HYPERELASTIC]: {
      name: '超弹性现象演示',
      description: '观察材料在冲击下的形变与恢复特性。'
    }
  };
  
  return experimentMap[props.experimentType] || { name: '未知实验', description: '' };
});

const firstDataRow = computed(() => {
  if (experimentResults.value?.results?.data?.length > 0) {
    return experimentResults.value.results.data[0];
  }
  return {};
});

// 获取实验配置
async function fetchExperimentConfiguration() {
  loading.value = true;
  error.value = null;
  
  try {
    configuration.value = await labService.getExperimentConfiguration(props.experimentType);
    
    // 设置默认参数
    if (configuration.value?.parameters) {
      configuration.value.parameters.forEach(param => {
        parameters[param.name] = param.default;
      });
    }
  } catch (err) {
    console.error('Failed to fetch experiment configuration:', err);
    error.value = '获取实验配置失败';
    
    // 使用模拟配置
    configuration.value = getMockConfiguration(props.experimentType);
    
    // 设置默认参数
    if (configuration.value?.parameters) {
      configuration.value.parameters.forEach(param => {
        parameters[param.name] = param.default;
      });
    }
  } finally {
    loading.value = false;
  }
}

// 运行实验
async function runExperiment() {
  experimentRunning.value = true;
  experimentStarted.value = true;
  progress.value = 0;
  
  try {
    // 创建实验会话
    experimentSession.value = await labService.createSession(
      props.experimentType,
      experimentData.value.name,
      experimentData.value.description,
      parameters
    );
    
    // 开始实验
    const result = await labService.runExperiment(experimentSession.value.id);
    
    // 定时轮询实验状态
    pollingInterval.value = setInterval(checkExperimentStatus, 1000);
  } catch (err) {
    console.error('Failed to run experiment:', err);
    error.value = '运行实验失败';
    
    // 使用模拟数据演示（在实际项目中应该移除这部分）
    simulateMockExperiment();
  }
}

// 检查实验状态
async function checkExperimentStatus() {
  if (!experimentSession.value?.id) return;
  
  try {
    const status = await labService.getExperimentStatus(experimentSession.value.id);
    
    progress.value = status.progress || Math.min(progress.value + Math.random() * 5, 99);
    
    if (status.status === 'completed') {
      clearInterval(pollingInterval.value);
      
      // 获取实验结果
      experimentResults.value = await labService.getExperimentResults(experimentSession.value.id);
      experimentRunning.value = false;
      progress.value = 100;
      
      // 渲染可视化图表
      renderVisualization();
    } else if (status.status === 'failed') {
      clearInterval(pollingInterval.value);
      error.value = '实验执行失败';
      experimentRunning.value = false;
    }
  } catch (err) {
    console.error('Failed to check experiment status:', err);
  }
}

// 渲染可视化图表
function renderVisualization() {
  if (!experimentResults.value || !visualizationContainer.value) return;
  
  // 根据实验类型渲染不同的可视化图表
  switch (props.experimentType) {
    case LabExperimentType.STATIC_PRESSURE:
      renderPressureChart();
      break;
    case LabExperimentType.REYNOLDS:
      renderReynoldsChart();
      break;
    case LabExperimentType.BERNOULLI:
      renderBernoulliChart();
      break;
    case LabExperimentType.FRICTION_LOSS:
      renderFrictionChart();
      break;
    case LabExperimentType.KARMAN_VORTEX:
      renderVortexVisualization();
      break;
    default:
      renderGenericChart();
  }
}

// 压力图表渲染
function renderPressureChart() {
  const container = visualizationContainer.value;
  if (!container) return;
  
  const data = experimentResults.value.results.data || [];
  if (!data.length) return;
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  // 假设数据中有"深度"和"测量压力"这些键
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d['深度']),
      datasets: [
        {
          label: '理论压力',
          data: data.map(d => d['理论压力']),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          fill: false
        },
        {
          label: '测量压力',
          data: data.map(d => d['测量压力']),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '静水压强分布',
          font: { size: 16 }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '深度 (m)'
          }
        },
        y: {
          title: {
            display: true,
            text: '压力 (Pa)'
          },
          beginAtZero: true
        }
      }
    }
  });
}

// 雷诺实验图表渲染
function renderReynoldsChart() {
  const container = visualizationContainer.value;
  if (!container) return;
  
  const data = experimentResults.value.results.data || [];
  if (!data.length) return;
  
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  // 准备层流、湍流和过渡态的数据点
  const laminarData = [];
  const transitionalData = [];
  const turbulentData = [];
  
  data.forEach(d => {
    if (d['流态'] === '层流') {
      laminarData.push(d);
    } else if (d['流态'] === '过渡态') {
      transitionalData.push(d);
    } else {
      turbulentData.push(d);
    }
  });
  
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: '层流',
          data: laminarData.map(d => ({
            x: d['雷诺数'],
            y: d['压力损失']
          })),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          pointRadius: 5
        },
        {
          label: '过渡态',
          data: transitionalData.map(d => ({
            x: d['雷诺数'],
            y: d['压力损失']
          })),
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          pointRadius: 5
        },
        {
          label: '湍流',
          data: turbulentData.map(d => ({
            x: d['雷诺数'],
            y: d['压力损失']
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '雷诺数与压力损失关系',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `雷诺数: ${point.x.toFixed(0)}, 压力损失: ${point.y.toFixed(4)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: '雷诺数 (Re)'
          },
          suggestedMin: 0
        },
        y: {
          title: {
            display: true,
            text: '压力损失 (Pa)'
          },
          beginAtZero: true
        }
      }
    }
  });
}

// 伯努利方程验证图表
function renderBernoulliChart() {
  renderGenericChart(); // 暂时使用通用图表，实际项目中可以实现专门的图表
}

// 摩擦损失图表
function renderFrictionChart() {
  renderGenericChart(); // 暂时使用通用图表，实际项目中可以实现专门的图表
}

// 卡门涡街可视化
function renderVortexVisualization() {
  renderGenericChart(); // 暂时使用通用图表，实际项目中可以实现专门的图表
}

// 通用图表渲染（示例）
function renderGenericChart() {
  // 这里只是一个示例，实际项目中应该根据不同实验结果实现具体的可视化
  const container = visualizationContainer.value;
  if (!container) return;
  
  const data = experimentResults.value.results.data || [];
  if (!data.length) return;
  
  // 获取数据的键名
  const keys = Object.keys(data[0]).filter(k => typeof data[0][k] === 'number');
  if (keys.length < 2) return;
  
  const xKey = keys[0];
  const yKey = keys[1];
  
  // 创建canvas元素
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  // 创建Chart.js图表
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d[xKey]),
      datasets: [{
        label: yKey,
        data: data.map(d => d[yKey]),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${yKey} vs ${xKey}`,
          font: {
            size: 16
          }
        },
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xKey
          }
        },
        y: {
          title: {
            display: true,
            text: yKey
          },
          beginAtZero: false
        }
      }
    }
  });
}

// 模拟实验过程（仅用于前端开发测试）
function simulateMockExperiment() {
  let progress = 0;
  
  // 模拟进度更新
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    progress = Math.min(progress, 100);
    progress.value = Math.floor(progress);
    
    if (progress >= 100) {
      clearInterval(interval);
      experimentRunning.value = false;
      
      // 设置模拟结果
      experimentResults.value = getMockResults(props.experimentType);
      
      // 渲染可视化图表
      renderVisualization();
    }
  }, 800);
}

// 获取模拟配置（根据实验类型）
function getMockConfiguration(experimentType) {
  // 默认配置
  const defaultConfig = {
    parameters: [
      {
        name: '流速',
        type: 'number',
        default: 1.0,
        range: [0.1, 5.0],
        step: 0.1
      },
      {
        name: '液体密度',
        type: 'number',
        default: 1000,
        range: [800, 1200],
        step: 10
      },
      {
        name: '粘度',
        type: 'number',
        default: 0.001,
        range: [0.0001, 0.01],
        step: 0.0001
      }
    ]
  };
  
  // 根据实验类型返回特定配置
  switch (experimentType) {
    case LabExperimentType.STATIC_PRESSURE:
      return {
        parameters: [
          {
            name: '液体深度',
            type: 'number',
            default: 1.0,
            range: [0.1, 3.0],
            step: 0.1
          },
          {
            name: '液体密度',
            type: 'number',
            default: 1000,
            range: [800, 1200],
            step: 10
          },
          {
            name: '容器形状',
            type: 'select',
            default: '圆柱形',
            options: ['圆柱形', '矩形', '锥形']
          }
        ]
      };
      
    case LabExperimentType.REYNOLDS:
      return {
        parameters: [
          {
            name: '流速',
            type: 'number',
            default: 0.2,
            range: [0.05, 2.0],
            step: 0.05
          },
          {
            name: '管径',
            type: 'number',
            default: 0.02,
            range: [0.005, 0.05],
            step: 0.001
          },
          {
            name: '流体类型',
            type: 'select',
            default: '水',
            options: ['水', '油', '甘油']
          },
          {
            name: '温度',
            type: 'number',
            default: 20,
            range: [10, 50],
            step: 1
          }
        ]
      };
    
    default:
      return defaultConfig;
  }
}

// 获取模拟结果（根据实验类型）
function getMockResults(experimentType) {
  // 默认结果
  const defaultResults = {
    id: 'mock-session-123',
    type: experimentType,
    name: experimentData.value.name,
    description: experimentData.value.description,
    created_at: new Date().toISOString(),
    parameters: { ...parameters },
    results: {
      data: Array.from({ length: 10 }, (_, i) => ({
        x: i,
        y: Math.random() * 10,
        z: Math.random() * 5
      }))
    }
  };
  
  // 根据实验类型返回特定结果
  switch (experimentType) {
    case LabExperimentType.STATIC_PRESSURE:
      return {
        id: 'mock-session-123',
        type: experimentType,
        name: experimentData.value.name,
        description: experimentData.value.description,
        created_at: new Date().toISOString(),
        parameters: { ...parameters },
        results: {
          data: Array.from({ length: 10 }, (_, i) => ({
            深度: i * 0.1,
            理论压力: i * 0.1 * 9.8 * parameters['液体密度'],
            测量压力: i * 0.1 * 9.8 * parameters['液体密度'] * (1 + (Math.random() - 0.5) * 0.1),
            误差百分比: (Math.random() - 0.5) * 10
          }))
        }
      };
      
    case LabExperimentType.REYNOLDS:
      const velocities = Array.from({ length: 20 }, (_, i) => 0.05 + i * 0.05);
      return {
        id: 'mock-session-123',
        type: experimentType,
        name: experimentData.value.name,
        description: experimentData.value.description,
        created_at: new Date().toISOString(),
        parameters: { ...parameters },
        results: {
          data: velocities.map(velocity => {
            const re = velocity * parameters['管径'] * 1000 / 0.001;
            return {
              流速: velocity,
              雷诺数: re,
              流态: re < 2000 ? '层流' : re > 4000 ? '湍流' : '过渡态',
              压力损失: velocity * velocity * 0.5 * (0.3164 / Math.pow(re, 0.25))
            };
          })
        }
      };
    
    default:
      return defaultResults;
  }
}

// 组件挂载时获取配置
onMounted(() => {
  fetchExperimentConfiguration();
});

// 监听实验类型变化
watch(() => props.experimentType, () => {
  // 重置状态
  experimentStarted.value = false;
  experimentRunning.value = false;
  experimentResults.value = null;
  experimentSession.value = null;
  
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
  
  // 重新获取配置
  fetchExperimentConfiguration();
});
</script> 