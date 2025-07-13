<template>
  <div class="simulation-view h-full overflow-auto">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">流体动力学模拟</h1>
      
      <!-- 模拟控制面板 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 模拟类型选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">模拟类型</label>
            <select 
              v-model="simulationType" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="boat-drifting">船只漂移</option>
              <option value="cylinder-flow">圆柱体绕流</option>
              <option value="karman-vortex">卡门涡街</option>
              <option value="tunnel-flow">通道流</option>
            </select>
          </div>
          
          <!-- 模拟参数 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">流体参数</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-20 text-sm text-gray-600">雷诺数</span>
                <input 
                  type="range" 
                  v-model.number="reynoldsNumber"
                  min="100"
                  max="10000"
                  step="100"
                  class="flex-grow mx-2"
                />
                <span class="w-12 text-right text-sm">{{ reynoldsNumber }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-20 text-sm text-gray-600">流速</span>
                <input 
                  type="range" 
                  v-model.number="flowSpeed"
                  min="0.1"
                  max="5"
                  step="0.1"
                  class="flex-grow mx-2"
                />
                <span class="w-12 text-right text-sm">{{ flowSpeed }}x</span>
              </div>
              <div class="flex items-center">
                <span class="w-20 text-sm text-gray-600">性能</span>
                <select 
                  v-model="performanceLevel" 
                  class="flex-grow mx-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="low">低 (流畅)</option>
                  <option value="medium">中 (平衡)</option>
                  <option value="high">高 (精细)</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 控制按钮 -->
          <div class="flex items-end">
            <button 
              @click="startSimulation" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
              :disabled="isRunning"
            >
              {{ isRunning ? '模拟中...' : '开始模拟' }}
            </button>
            <button 
              @click="resetSimulation" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="!isRunning"
            >
              重置
            </button>
          </div>
        </div>
      </div>
      
      <!-- 模拟视图区域 -->
      <div class="bg-blue-900 rounded-lg shadow-lg overflow-hidden" style="height: 60vh;">
        <div class="relative h-full">
          <!-- 模拟画布 -->
          <canvas ref="simulationCanvas" class="absolute inset-0 w-full h-full"></canvas>
          
          <!-- 全屏按钮 -->
          <div class="absolute top-4 left-4 bg-blue-900/80 backdrop-blur-sm rounded-lg p-2 flex space-x-2">
            <button 
              @click="toggleFullScreen" 
              class="text-white hover:bg-blue-800/80 transition-colors p-1 rounded"
              title="全屏/退出全屏"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-if="!isFullScreen">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              @click="takeScreenshot" 
              class="text-white hover:bg-blue-800/80 transition-colors p-1 rounded"
              title="保存截图"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <!-- 参数面板 -->
          <div class="absolute top-4 right-4 bg-blue-900/80 backdrop-blur-sm rounded-lg p-4 w-64 text-white max-h-[calc(100%-2rem)] overflow-y-auto">
            <h3 class="text-lg font-medium mb-3 text-blue-200">船体参数</h3>
            
            <div class="space-y-3">
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船长</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="3"
                    max="8"
                    step="0.5"
                    v-model.number="boatLength"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ boatLength }}</span>
                </div>
              </div>
              
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船宽</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    v-model.number="boatWidth"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ boatWidth }}</span>
                </div>
              </div>
              
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船底宽度比</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.1"
                    v-model.number="bottomWidth"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ bottomWidth }}</span>
                </div>
              </div>
              
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船高</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    v-model.number="boatHeight"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ boatHeight }}</span>
                </div>
              </div>
              
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船头形状</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    v-model.number="bowShape"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ bowShape }}</span>
                </div>
              </div>
              
              <div>
                <label class="text-sm text-blue-300 mb-1 block">船尾形状</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    v-model.number="sternShape"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ sternShape }}</span>
                </div>
              </div>
              
              <div class="pt-2">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="symmetry"
                    class="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span class="ml-2 text-sm text-blue-300">左右对称船体</span>
                </label>
              </div>
              
              <div class="pt-2">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="showMooring"
                    class="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span class="ml-2 text-sm text-blue-300">显示系泊绳索</span>
                </label>
              </div>
              
              <div v-if="showMooring">
                <label class="text-sm text-blue-300 mb-1 block">系泊位置</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    v-model.number="mooringPosition"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-16">
                    {{ mooringPosition < -0.3 ? "船头" : 
                    mooringPosition > 0.3 ? "船尾" : "中部" }}
                  </span>
                </div>
              </div>
              
              <div v-if="showMooring">
                <label class="text-sm text-blue-300 mb-1 block">绳索长度</label>
                <div class="flex items-center">
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    v-model.number="mooringLength"
                    class="w-full"
                  />
                  <span class="ml-2 text-sm text-blue-100 w-8">{{ mooringLength }}</span>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <button 
                @click="toggleAnalysisTools" 
                class="w-full px-3 py-1.5 bg-blue-700/50 hover:bg-blue-700/70 text-blue-100 rounded text-sm"
              >
                {{ showAnalysisTools ? '隐藏分析工具' : '显示分析工具' }}
              </button>
            </div>
          </div>
          
          <!-- 分析工具面板 -->
          <div v-if="showAnalysisTools" class="absolute bottom-4 left-4 bg-blue-900/80 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 class="text-sm font-medium mb-2 text-blue-200">分析工具</h3>
            
            <div class="flex space-x-2 mb-3">
              <button 
                @click="setAnalysisTool('streamlines')" 
                :class="`px-2 py-1 rounded text-xs ${analysisTool === 'streamlines' ? 'bg-blue-600 text-white' : 'bg-blue-800/50 text-blue-300'}`"
              >
                流线
              </button>
              <button 
                @click="setAnalysisTool('pressure')" 
                :class="`px-2 py-1 rounded text-xs ${analysisTool === 'pressure' ? 'bg-blue-600 text-white' : 'bg-blue-800/50 text-blue-300'}`"
              >
                压力场
              </button>
              <button 
                @click="setAnalysisTool('velocity')" 
                :class="`px-2 py-1 rounded text-xs ${analysisTool === 'velocity' ? 'bg-blue-600 text-white' : 'bg-blue-800/50 text-blue-300'}`"
              >
                速度场
              </button>
            </div>
            
            <div class="text-xs text-blue-200">
              <div class="mb-1">当前角度: {{ currentAngle.toFixed(1) }}°</div>
              <div>力矩: {{ torque.toFixed(3) }} N·m</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 数据展示区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-medium mb-4 text-gray-800">模拟数据</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">时间步长:</span>
              <span>{{ timeStep.toFixed(4) }} s</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">计算步数:</span>
              <span>{{ steps }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">雷诺数:</span>
              <span>{{ reynoldsNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">最大速度:</span>
              <span>{{ maxVelocity.toFixed(2) }} m/s</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-medium mb-4 text-gray-800">物理解释</h3>
          <p class="text-gray-600">
            船只在水流中的稳定性与其形状、质量分布以及系泊方式密切相关。当水流作用于船体时，
            会在船体表面产生不均匀的压力分布，进而产生力和力矩。根据流体动力学理论，
            特别是椭圆柱体在流体中的受力分析，可以解释为什么船只最终会稳定在与水流垂直的位置。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'SimulationView',
  
  props: {
    simulationType: {
      type: String,
      default: 'boat-drifting'
    }
  },
  
  setup(props) {
    // 模拟参数
    const simulationType = ref(props.simulationType);
    const reynoldsNumber = ref(1000);
    const flowSpeed = ref(1.0);
    const isRunning = ref(false);
    const timeStep = ref(0.01);
    const steps = ref(0);
    const maxVelocity = ref(1.5);
    const currentAngle = ref(45);
    const torque = ref(0.125);
    const performanceLevel = ref('medium');
    
    // 船体参数
    const boatLength = ref(5);
    const boatWidth = ref(2.5);
    const bottomWidth = ref(0.4);
    const boatHeight = ref(1.0);
    const bowShape = ref(0.3);
    const sternShape = ref(0.4);
    const symmetry = ref(true);
    
    // 系泊参数
    const showMooring = ref(true);
    const mooringPosition = ref(-0.5);
    const mooringLength = ref(6.0);
    
    // 分析工具
    const showAnalysisTools = ref(false);
    const analysisTool = ref('streamlines');
    
    // 全屏状态
    const isFullScreen = ref(false);
    
    // Three.js相关
    const simulationCanvas = ref(null);
    let scene, camera, renderer, controls;
    let boat, water;
    let animationFrameId;
    
    // 切换全屏
    const toggleFullScreen = () => {
      const simulationContainer = document.querySelector('.simulation-view');
      
      if (!document.fullscreenElement) {
        // 进入全屏
        if (simulationContainer.requestFullscreen) {
          simulationContainer.requestFullscreen();
        } else if (simulationContainer.mozRequestFullScreen) { // Firefox
          simulationContainer.mozRequestFullScreen();
        } else if (simulationContainer.webkitRequestFullscreen) { // Chrome, Safari, Opera
          simulationContainer.webkitRequestFullscreen();
        } else if (simulationContainer.msRequestFullscreen) { // IE/Edge
          simulationContainer.msRequestFullscreen();
        }
        isFullScreen.value = true;
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
        }
        isFullScreen.value = false;
      }
    };
    
    // 监听全屏状态变化
    const handleFullScreenChange = () => {
      isFullScreen.value = Boolean(
        document.fullscreenElement || 
        document.mozFullScreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };
    
    // 初始化Three.js场景
    const initThreeScene = () => {
      if (!simulationCanvas.value) return;
      
      // 创建场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a1929);
      
      // 创建相机
      camera = new THREE.PerspectiveCamera(
        50, 
        simulationCanvas.value.clientWidth / simulationCanvas.value.clientHeight, 
        0.1, 
        1000
      );
      camera.position.set(0, 10, 15);
      
      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ 
        canvas: simulationCanvas.value,
        antialias: true 
      });
      renderer.setSize(simulationCanvas.value.clientWidth, simulationCanvas.value.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      
      // 添加灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      // 添加控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = true;
      controls.minPolarAngle = Math.PI / 6;
      controls.maxPolarAngle = Math.PI / 2.2;
      
      // 创建水面
      createWaterSurface();
      
      // 创建船体
      createBoat();
      
      // 开始渲染循环
      animate();
      
      // 窗口大小变化时调整
      window.addEventListener('resize', onWindowResize);
    };
    
    // 创建水面
    const createWaterSurface = () => {
      // 根据性能级别调整水面网格密度
      let resolution;
      switch (performanceLevel.value) {
        case 'low':
          resolution = 20;
          break;
        case 'high':
          resolution = 100;
          break;
        default: // medium
          resolution = 50;
      }
      
      const waterGeometry = new THREE.PlaneGeometry(100, 100, resolution, resolution);
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066cc,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        wireframe: false
      });
      
      water = new THREE.Mesh(waterGeometry, waterMaterial);
      water.rotation.x = -Math.PI / 2;
      water.position.y = -0.1;
      water.receiveShadow = true;
      scene.add(water);
      
      // 添加水流可视化
      createWaterFlow();
    };
    
    // 创建水流可视化
    const createWaterFlow = () => {
      const flowGeometry = new THREE.BufferGeometry();
      const flowVertices = [];
      const flowColors = [];
      
      // 根据性能级别调整流线数量
      let flowLineCount;
      switch (performanceLevel.value) {
        case 'low':
          flowLineCount = 50;
          break;
        case 'high':
          flowLineCount = 200;
          break;
        default: // medium
          flowLineCount = 100;
      }
      
      // 创建流线
      for (let i = 0; i < flowLineCount; i++) {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        
        for (let j = 0; j < 10; j++) {
          const segmentX = x - j * flowSpeed.value;
          flowVertices.push(segmentX, 0.2, z);
          
          // 颜色渐变
          const intensity = 1 - j / 10;
          flowColors.push(0.1, 0.5, 0.9, intensity);
        }
      }
      
      flowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(flowVertices, 3));
      flowGeometry.setAttribute('color', new THREE.Float32BufferAttribute(flowColors, 4));
      
      const flowMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true
      });
      
      const flowLines = new THREE.LineSegments(flowGeometry, flowMaterial);
      scene.add(flowLines);
      
      // 更新水流动画
      const updateWaterFlow = () => {
        const positions = flowGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] -= 0.05 * flowSpeed.value;
          
          // 如果流线移出视野，重置位置
          if (positions[i] < -40) {
            positions[i] += 80;
          }
        }
        
        flowGeometry.attributes.position.needsUpdate = true;
      };
      
      // 注册水流更新回调
      const updateWaterFlowCallback = () => {
        if (isRunning.value) {
          updateWaterFlow();
        }
      };
    };
    
    // 创建船体
    const createBoat = () => {
      // 使用参数化几何体创建船体
      const shape = new THREE.Shape();
      
      // 船体长度和宽度的一半
      const halfLength = boatLength.value / 2;
      const halfWidth = boatWidth.value / 2;
      const bottomHalfWidth = halfWidth * bottomWidth.value;
      
      // 创建船体轮廓
      shape.moveTo(-halfLength, -bottomHalfWidth);
      
      // 船头（左侧）
      shape.bezierCurveTo(
        -halfLength * (1 - bowShape.value), -bottomHalfWidth,
        -halfLength * (1 - bowShape.value), -halfWidth,
        -halfLength, -halfWidth
      );
      
      // 船的左侧
      shape.lineTo(halfLength, -halfWidth);
      
      // 船尾（右侧）
      shape.bezierCurveTo(
        halfLength * (1 - sternShape.value), -halfWidth,
        halfLength * (1 - sternShape.value), -bottomHalfWidth,
        halfLength, -bottomHalfWidth
      );
      
      // 船底
      shape.lineTo(-halfLength, -bottomHalfWidth);
      
      // 挤压设置
      const extrudeSettings = {
        steps: 1,
        depth: boatHeight.value,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 3
      };
      
      // 创建几何体
      const boatGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      boatGeometry.rotateX(Math.PI / 2);
      
      // 创建船体材质
      const boatMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7,
        metalness: 0.1
      });
      
      // 创建船体网格
      boat = new THREE.Mesh(boatGeometry, boatMaterial);
      boat.position.set(0, boatHeight.value / 2, 0);
      boat.castShadow = true;
      boat.receiveShadow = true;
      
      // 旋转船体
      boat.rotation.y = currentAngle.value * Math.PI / 180;
      
      // 如果启用系泊，添加系泊绳索
      if (showMooring.value) {
        createMooringRope();
      }
      
      scene.add(boat);
    };
    
    // 创建系泊绳索
    const createMooringRope = () => {
      // 计算系泊点位置
      const mooringX = boatLength.value * mooringPosition.value / 2;
      
      // 创建系泊点
      const mooringPointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const mooringPointMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
      const mooringPoint = new THREE.Mesh(mooringPointGeometry, mooringPointMaterial);
      mooringPoint.position.set(mooringX, 0, 0);
      boat.add(mooringPoint);
      
      // 创建系泊绳索
      const ropePoints = [];
      const segments = 20;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = mooringX * (1 - t);
        const y = -0.5 * Math.sin(Math.PI * t); // 弧形下垂
        const z = -mooringLength.value * t;
        ropePoints.push(new THREE.Vector3(x, y, z));
      }
      
      const ropeCurve = new THREE.CatmullRomCurve3(ropePoints);
      const ropeGeometry = new THREE.TubeGeometry(ropeCurve, 20, 0.05, 8, false);
      const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
      boat.add(rope);
    };
    
    // 窗口大小变化处理
    const onWindowResize = () => {
      if (!simulationCanvas.value || !camera || !renderer) return;
      
      camera.aspect = simulationCanvas.value.clientWidth / simulationCanvas.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(simulationCanvas.value.clientWidth, simulationCanvas.value.clientHeight);
    };
    
    // 渲染循环
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // 执行水流更新回调（如果已定义）
      if (typeof updateWaterFlowCallback === 'function') {
        updateWaterFlowCallback();
      }
      
      if (isRunning.value) {
        // 更新模拟步数
        steps.value++;
        
        // 如果是船只漂移模拟，更新船只角度
        if (simulationType.value === 'boat-drifting' && boat) {
          // 计算力矩（简化模型）
          const angle = boat.rotation.y;
          const a = boatLength.value / 2;
          const b = boatWidth.value / 2;
          const density = 1.0;
          
          // 椭圆柱体在流体中受到的力矩公式: M = (1/2)πρ(a²-b²)v²sin(2α)
          torque.value = 0.5 * Math.PI * density * (a*a - b*b) * flowSpeed.value * flowSpeed.value * Math.sin(2 * angle);
          
          // 根据力矩更新船的角度
          const angularAcceleration = torque.value * 0.01;
          boat.rotation.y += angularAcceleration;
          
          // 更新当前角度（转换为度）
          currentAngle.value = (boat.rotation.y * 180 / Math.PI) % 360;
          if (currentAngle.value < 0) currentAngle.value += 360;
          
          // 模拟水面波动
          if (water && water.geometry.isBufferGeometry) {
            const positions = water.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i];
              const z = positions[i + 2];
              
              // 添加波动效果
              positions[i + 1] = Math.sin(x * 0.1 + time) * 0.1 + 
                               Math.sin(z * 0.1 + time * 0.8) * 0.1;
              
              // 在船周围增加额外波动
              const dx = x - boat.position.x;
              const dz = z - boat.position.z;
              const dist = Math.sqrt(dx * dx + dz * dz);
              
              if (dist < 10) {
                positions[i + 1] += (1 - dist / 10) * 0.2 * Math.sin(time * 3);
              }
            }
            
            water.geometry.attributes.position.needsUpdate = true;
          }
        }
      }
      
      // 更新控制器
      if (controls) {
        controls.update();
      }
      
      // 渲染场景
      if (scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    // 开始模拟
    const startSimulation = () => {
      isRunning.value = true;
    };
    
    // 重置模拟
    const resetSimulation = () => {
      isRunning.value = false;
      steps.value = 0;
      
      if (boat) {
        boat.rotation.y = 45 * Math.PI / 180; // 重置为45度
        currentAngle.value = 45;
      }
    };
    
    // 切换分析工具
    const toggleAnalysisTools = () => {
      showAnalysisTools.value = !showAnalysisTools.value;
    };
    
    // 设置分析工具类型
    const setAnalysisTool = (tool) => {
      analysisTool.value = tool;
    };
    
    // 截图功能
    const takeScreenshot = () => {
      if (!renderer) return;
      
      // 暂停模拟
      const wasRunning = isRunning.value;
      isRunning.value = false;
      
      // 渲染一帧
      renderer.render(scene, camera);
      
      try {
        // 获取图像数据
        const imgData = renderer.domElement.toDataURL('image/png');
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `流体模拟-${simulationType.value}-${new Date().toISOString().slice(0, 10)}.png`;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 显示成功消息
        showMessage('截图已保存');
      } catch (error) {
        console.error('截图保存失败:', error);
        showMessage('截图保存失败', true);
      }
      
      // 恢复模拟状态
      isRunning.value = wasRunning;
    };
    
    // 显示消息
    const showMessage = (text, isError = false) => {
      // 创建消息元素
      const message = document.createElement('div');
      message.textContent = text;
      message.className = `fixed top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${
        isError ? 'bg-red-500' : 'bg-green-500'
      } shadow-lg z-50 transition-opacity duration-300`;
      
      // 添加到页面
      document.body.appendChild(message);
      
      // 淡出效果
      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(message);
        }, 300);
      }, 2000);
    };
    
    // 监听性能级别变化，重新创建场景
    watch(performanceLevel, () => {
      // 清理现有场景
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        
        while(scene.children.length > 0) { 
          scene.remove(scene.children[0]); 
        }
      }
      
      // 重新创建场景元素
      createWaterSurface();
      createBoat();
      
      // 重新添加灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
    });
    
    // 组件挂载时初始化
    onMounted(() => {
      initThreeScene();
      
      // 添加全屏变化事件监听
      document.addEventListener('fullscreenchange', handleFullScreenChange);
      document.addEventListener('mozfullscreenchange', handleFullScreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.addEventListener('msfullscreenchange', handleFullScreenChange);
    });
    
    // 组件卸载前清理资源
    onBeforeUnmount(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      window.removeEventListener('resize', onWindowResize);
      
      // 移除全屏变化事件监听
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
      
      // 清理Three.js资源
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      
      if (renderer) {
        renderer.dispose();
      }
    });
    
    return {
      simulationType,
      reynoldsNumber,
      flowSpeed,
      isRunning,
      timeStep,
      steps,
      maxVelocity,
      currentAngle,
      torque,
      boatLength,
      boatWidth,
      bottomWidth,
      boatHeight,
      bowShape,
      sternShape,
      symmetry,
      showMooring,
      mooringPosition,
      mooringLength,
      showAnalysisTools,
      analysisTool,
      simulationCanvas,
      isFullScreen,
      performanceLevel,
      startSimulation,
      resetSimulation,
      toggleAnalysisTools,
      toggleFullScreen,
      setAnalysisTool,
      takeScreenshot,
      showMessage
    };
  }
};
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="checkbox"] {
  accent-color: #3b82f6;
}

.simulation-view {
  height: calc(100vh - 56px); /* 减去导航栏高度 */
}

/* 全屏样式 */
.simulation-view:fullscreen {
  height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.simulation-view:fullscreen .bg-blue-900 {
  height: calc(100vh - 14rem);
}

/* Firefox */
.simulation-view:-moz-full-screen {
  height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.simulation-view:-moz-full-screen .bg-blue-900 {
  height: calc(100vh - 14rem);
}

/* Chrome, Safari and Opera */
.simulation-view:-webkit-full-screen {
  height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.simulation-view:-webkit-full-screen .bg-blue-900 {
  height: calc(100vh - 14rem);
}

/* IE/Edge */
.simulation-view:-ms-fullscreen {
  height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.simulation-view:-ms-fullscreen .bg-blue-900 {
  height: calc(100vh - 14rem);
}
</style> 