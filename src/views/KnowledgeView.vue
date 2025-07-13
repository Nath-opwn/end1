<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-blue-800 mb-6">流体动力学知识库</h1>
    
    <!-- 搜索栏 -->
    <div class="mb-8">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索知识库..." 
          class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    
    <!-- 知识分类选项卡 -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px">
          <li 
            v-for="category in categories" 
            :key="category.id" 
            class="mr-2"
          >
            <button
              @click="selectedCategory = category.id"
              :class="[
                'inline-block px-4 py-2 font-medium text-sm rounded-t-lg',
                selectedCategory === category.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ category.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 知识内容 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 左侧导航 -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h3 class="font-medium text-gray-800 mb-3">文章目录</h3>
          <ul class="space-y-2">
            <li v-for="article in filteredArticles" :key="article.id">
              <button
                @click="selectArticle(article)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  selectedArticle?.id === article.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                ]"
              >
                {{ article.title }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="md:col-span-2">
        <div v-if="selectedArticle" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-blue-800 mb-4">{{ selectedArticle.title }}</h2>
          <div class="prose max-w-none" v-html="selectedArticle.content"></div>
          
          <!-- 相关文章 -->
          <div class="mt-8 pt-4 border-t border-gray-200">
            <h3 class="font-medium text-gray-800 mb-3">相关文章</h3>
            <ul class="space-y-1">
              <li v-for="related in selectedArticle.related" :key="related.id">
                <button
                  @click="selectArticle(getArticleById(related.id))"
                  class="text-blue-600 hover:underline text-sm"
                >
                  {{ related.title }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-md p-6">
          <div class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 class="mt-2 text-gray-600">请从左侧选择一篇文章查看</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 知识分类
const categories = [
  { id: 'all', name: '全部' },
  { id: 'basic', name: '基础理论' },
  { id: 'advanced', name: '高级概念' },
  { id: 'application', name: '应用案例' }
];

// 知识文章数据
const articles = [
  {
    id: '1',
    category: 'basic',
    title: '流体力学基本方程',
    content: `
      <p>流体力学基本方程是描述流体运动的数学方程组，主要包括连续性方程、动量方程和能量方程。</p>
      <h3>连续性方程</h3>
      <p>连续性方程表示质量守恒定律，对于不可压缩流体，可以表示为：</p>
      <div class="bg-gray-50 p-3 rounded my-2">∇·V = 0</div>
      <p>其中V是流体的速度场。</p>
      <h3>动量方程</h3>
      <p>动量方程（也称为Navier-Stokes方程）表示牛顿第二定律在流体中的应用：</p>
      <div class="bg-gray-50 p-3 rounded my-2">ρ(∂V/∂t + V·∇V) = -∇p + μ∇²V + ρg</div>
      <p>其中ρ是流体密度，p是压力，μ是动力粘度，g是重力加速度。</p>
    `,
    related: [
      { id: '2', title: '雷诺数与流动状态' },
      { id: '3', title: '伯努利方程及其应用' }
    ]
  },
  {
    id: '2',
    category: 'basic',
    title: '雷诺数与流动状态',
    content: `
      <p>雷诺数是流体力学中一个无量纲参数，表示惯性力与粘性力的比值，定义为：</p>
      <div class="bg-gray-50 p-3 rounded my-2">Re = ρVL/μ</div>
      <p>其中ρ是流体密度，V是特征速度，L是特征长度，μ是动力粘度。</p>
      <h3>雷诺数的物理意义</h3>
      <p>雷诺数大小决定了流动状态：</p>
      <ul class="list-disc pl-5 my-2">
        <li>低雷诺数（Re < 2300）：层流，流体沿平行层流动</li>
        <li>过渡区（2300 < Re < 4000）：从层流向湍流过渡</li>
        <li>高雷诺数（Re > 4000）：湍流，流体运动变得混乱无序</li>
      </ul>
      <p>雷诺数是进行流动相似性分析和模型实验设计的重要参数。</p>
    `,
    related: [
      { id: '1', title: '流体力学基本方程' },
      { id: '4', title: '边界层理论' }
    ]
  },
  {
    id: '3',
    category: 'basic',
    title: '伯努利方程及其应用',
    content: `
      <p>伯努利方程描述了理想流体在定常流动中压力、速度和位置之间的关系：</p>
      <div class="bg-gray-50 p-3 rounded my-2">p + 1/2ρV² + ρgh = 常数</div>
      <p>其中p是压力，ρ是流体密度，V是流速，g是重力加速度，h是高度。</p>
      <h3>应用实例</h3>
      <p>伯努利方程广泛应用于：</p>
      <ul class="list-disc pl-5 my-2">
        <li>文丘里管：用于测量管道中的流量</li>
        <li>飞机机翼：解释升力产生的原理</li>
        <li>喷射器和喷嘴：计算出口速度</li>
        <li>托里拆利定律：计算孔口流出液体的速度</li>
      </ul>
    `,
    related: [
      { id: '1', title: '流体力学基本方程' },
      { id: '5', title: '船只在水流中的漂移现象' }
    ]
  },
  {
    id: '4',
    category: 'advanced',
    title: '边界层理论',
    content: `
      <p>边界层理论是由普朗特在1904年提出的，用于解决粘性流体在固体表面附近的流动问题。</p>
      <h3>边界层概念</h3>
      <p>当流体流过物体表面时，由于粘性作用，流体与物体表面接触的部分会附着在表面上（无滑移条件），形成速度梯度区域，这个区域称为边界层。</p>
      <h3>边界层特性</h3>
      <ul class="list-disc pl-5 my-2">
        <li>边界层厚度通常随着从前缘到后缘的距离增加而增加</li>
        <li>在边界层内，粘性力起主导作用</li>
        <li>边界层外，流体可以近似为无粘流动</li>
      </ul>
      <p>边界层理论的引入大大简化了流体动力学问题的求解，将流场分为边界层内和边界层外两个区域分别处理。</p>
    `,
    related: [
      { id: '2', title: '雷诺数与流动状态' },
      { id: '6', title: '湍流模型与数值模拟' }
    ]
  },
  {
    id: '5',
    category: 'application',
    title: '船只在水流中的漂移现象',
    content: `
      <p>船只在水流中会自然地转向与水流方向垂直的位置，这是一种有趣的流体动力学现象。</p>
      <h3>物理机理</h3>
      <p>当船只与水流方向成一定角度时，水流对船体两侧产生不对称的压力分布，形成转向力矩。这个力矩会使船只转向，直到达到一个与水流方向垂直的稳定位置。</p>
      <h3>数学模型</h3>
      <p>对于简化的椭圆柱体船型，受到的力矩可以近似为：</p>
      <div class="bg-gray-50 p-3 rounded my-2">M = (1/2)πρ(a²-b²)v²sin(2α)</div>
      <p>其中M是力矩，ρ是水的密度，a和b分别是船体的长半轴和短半轴，v是水流速度，α是船体与水流方向的夹角。</p>
      <p>从该公式可以看出，当α=90°（船体与水流垂直）时，sin(2α)=0，力矩为零，系统处于稳定状态。</p>
    `,
    related: [
      { id: '3', title: '伯努利方程及其应用' },
      { id: '7', title: '流体中的稳定性理论' }
    ]
  },
  {
    id: '6',
    category: 'advanced',
    title: '湍流模型与数值模拟',
    content: `
      <p>湍流是流体力学中最复杂的问题之一，其特点是混乱无序的流动状态，具有强烈的三维性、不规则性和扩散性。</p>
      <h3>常用湍流模型</h3>
      <ul class="list-disc pl-5 my-2">
        <li>直接数值模拟(DNS)：直接求解完整的N-S方程，计算量极大</li>
        <li>大涡模拟(LES)：模拟大尺度涡，参数化小尺度涡</li>
        <li>雷诺平均N-S方程(RANS)：最常用的工程方法，如k-ε模型、k-ω模型等</li>
      </ul>
      <h3>计算流体动力学(CFD)应用</h3>
      <p>现代CFD软件使用有限体积法、有限元法等数值方法，结合适当的湍流模型，可以模拟复杂几何条件下的流动问题，广泛应用于航空航天、船舶设计、气象预报等领域。</p>
    `,
    related: [
      { id: '4', title: '边界层理论' },
      { id: '8', title: '计算流体动力学在工程中的应用' }
    ]
  },
  {
    id: '7',
    category: 'advanced',
    title: '流体中的稳定性理论',
    content: `
      <p>流体稳定性理论研究流体系统在受到微小扰动后的响应行为，是理解流动转捩机制的重要工具。</p>
      <h3>线性稳定性分析</h3>
      <p>将流动参数分解为平均量和扰动量，然后线性化N-S方程，得到扰动的演化方程。如果扰动随时间衰减，则系统稳定；如果扰动放大，则系统不稳定。</p>
      <h3>经典不稳定性机制</h3>
      <ul class="list-disc pl-5 my-2">
        <li>Kelvin-Helmholtz不稳定性：剪切层中的不稳定性</li>
        <li>Rayleigh-Taylor不稳定性：重流体位于轻流体之上时的不稳定性</li>
        <li>Tollmien-Schlichting波：边界层中的不稳定波动</li>
      </ul>
      <p>稳定性理论为理解许多自然现象提供了理论基础，如大气和海洋中的波动、湍流产生的机制等。</p>
    `,
    related: [
      { id: '5', title: '船只在水流中的漂移现象' },
      { id: '6', title: '湍流模型与数值模拟' }
    ]
  },
  {
    id: '8',
    category: 'application',
    title: '计算流体动力学在工程中的应用',
    content: `
      <p>计算流体动力学(CFD)是应用数值方法求解流体力学问题的学科，已成为工程设计中不可或缺的工具。</p>
      <h3>主要应用领域</h3>
      <ul class="list-disc pl-5 my-2">
        <li>航空航天：飞机机翼设计、火箭发动机优化</li>
        <li>汽车工业：空气动力学设计、发动机冷却系统分析</li>
        <li>船舶工程：船体阻力计算、推进系统设计</li>
        <li>土木工程：建筑物风载荷分析、桥梁抗风设计</li>
        <li>能源工程：风力发电机设计、核反应堆冷却系统分析</li>
      </ul>
      <h3>CFD工作流程</h3>
      <ol class="list-decimal pl-5 my-2">
        <li>几何建模：创建计算域的几何模型</li>
        <li>网格生成：将计算域离散为网格</li>
        <li>物理建模：设置边界条件、选择适当的湍流模型</li>
        <li>数值求解：使用适当的算法求解控制方程</li>
        <li>结果分析：处理数值结果、可视化分析</li>
      </ol>
    `,
    related: [
      { id: '6', title: '湍流模型与数值模拟' },
      { id: '5', title: '船只在水流中的漂移现象' }
    ]
  }
];

// 状态变量
const selectedCategory = ref('all');
const selectedArticle = ref(null);
const searchQuery = ref('');

// 过滤后的文章列表
const filteredArticles = computed(() => {
  let filtered = articles;
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value);
  }
  
  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(keyword) || 
      article.content.toLowerCase().includes(keyword)
    );
  }
  
  return filtered;
});

// 根据ID获取文章
const getArticleById = (id) => {
  return articles.find(article => article.id === id);
};

// 选择文章
const selectArticle = (article) => {
  selectedArticle.value = article;
};
</script> 