import axios from 'axios';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: 'https://fkgajhijzwnm.sealoshzh.site',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，用于添加认证令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 用户登录
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    try {
      const response = await apiClient.post('/api/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 用户注册
  register: async (username, email, password) => {
    try {
      const response = await apiClient.post(`/api/auth/register?username=${username}&email=${email}&password=${password}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 退出登录
  logout: () => {
    localStorage.removeItem('access_token');
  }
};

// 模拟相关API
export const simulationApi = {
  // 创建模拟会话
  createSession: async (name, description, params) => {
    try {
      const response = await apiClient.post(`/api/simulation/session?name=${name}&description=${description}`, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 保存模拟结果
  saveResult: async (sessionId, step, velocityData, pressureData, vorticityData, statistics) => {
    try {
      let url = `/api/simulation/result/${sessionId}?step=${step}`;
      
      if (velocityData) url += `&velocity_data=${velocityData}`;
      if (pressureData) url += `&pressure_data=${pressureData}`;
      if (vorticityData) url += `&vorticity_data=${vorticityData}`;
      
      const response = await apiClient.post(url, statistics || {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 保存详细模拟数据
  saveData: async (sessionId, step, timeStep, viscosity, density, gridSize, surfaceTensionCoefficient, interfaceCurvatureData, contactAngle, contactLineData) => {
    try {
      let url = `/api/simulation/data/${sessionId}?step=${step}&time_step=${timeStep}&viscosity=${viscosity}&density=${density}`;
      
      if (surfaceTensionCoefficient) url += `&surface_tension_coefficient=${surfaceTensionCoefficient}`;
      if (interfaceCurvatureData) url += `&interface_curvature_data=${interfaceCurvatureData}`;
      if (contactAngle) url += `&contact_angle=${contactAngle}`;
      if (contactLineData) url += `&contact_line_data=${contactLineData}`;
      
      const response = await apiClient.post(url, gridSize);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取模拟数据列表
  getSimulationData: async (sessionId, limit = 100, offset = 0) => {
    try {
      const response = await apiClient.get(`/api/simulation/data/${sessionId}?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 保存表面张力配置
  saveSurfaceTensionConfig: async (sessionId, method, coefficient, parameters = {}) => {
    try {
      const response = await apiClient.post(`/api/simulation/surface-tension/${sessionId}?method=${method}&coefficient=${coefficient}`, parameters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取表面张力配置
  getSurfaceTensionConfig: async (sessionId) => {
    try {
      const response = await apiClient.get(`/api/simulation/surface-tension/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 保存接触角配置
  saveContactAngleConfig: async (sessionId, angle, model, parameters = {}) => {
    try {
      const response = await apiClient.post(`/api/simulation/contact-angle/${sessionId}?angle=${angle}&model=${model}`, parameters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取接触角配置
  getContactAngleConfig: async (sessionId) => {
    try {
      const response = await apiClient.get(`/api/simulation/contact-angle/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 保存性能指标数据
  savePerformanceMetric: async (sessionId, implementation, stepCount, totalTime, stepsPerSecond, memoryUsage, details = {}) => {
    try {
      let url = `/api/simulation/performance/${sessionId}?implementation=${implementation}&step_count=${stepCount}&total_time=${totalTime}&steps_per_second=${stepsPerSecond}`;
      
      if (memoryUsage) url += `&memory_usage=${memoryUsage}`;
      
      const response = await apiClient.post(url, details);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取模拟会话列表
  getSessions: async (userId = null, limit = 100, offset = 0) => {
    try {
      let url = `/api/simulation/sessions?limit=${limit}&offset=${offset}`;
      if (userId) url += `&user_id=${userId}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取模拟结果列表
  getResults: async (sessionId, limit = 100, offset = 0) => {
    try {
      const response = await apiClient.get(`/api/simulation/results/${sessionId}?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取性能指标数据
  getPerformanceMetrics: async (sessionId = null, implementation = null) => {
    try {
      let url = '/api/simulation/performance';
      const params = [];
      
      if (sessionId) params.push(`session_id=${sessionId}`);
      if (implementation) params.push(`implementation=${implementation}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// 知识库相关API
export const knowledgeApi = {
  // 获取知识项列表
  getItems: async (category = null, tag = null, limit = 100, offset = 0) => {
    try {
      let url = `/api/knowledge/items?limit=${limit}&offset=${offset}`;
      
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建知识项
  createItem: async (title, category, content, tags) => {
    try {
      const response = await apiClient.post(`/api/knowledge/items?title=${title}&category=${category}&content=${content}&tags=${tags}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取知识项详情
  getItem: async (itemId) => {
    try {
      const response = await apiClient.get(`/api/knowledge/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 更新知识项
  updateItem: async (itemId, title = null, category = null, content = null, tags = null) => {
    try {
      let url = `/api/knowledge/items/${itemId}`;
      const params = [];
      
      if (title) params.push(`title=${title}`);
      if (category) params.push(`category=${category}`);
      if (content) params.push(`content=${content}`);
      if (tags) params.push(`tags=${tags}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await apiClient.put(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 删除知识项
  deleteItem: async (itemId) => {
    try {
      const response = await apiClient.delete(`/api/knowledge/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取所有分类
  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/knowledge/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取所有标签
  getTags: async () => {
    try {
      const response = await apiClient.get('/api/knowledge/tags');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// 教程相关API
export const tutorialApi = {
  // 获取教程列表
  getTutorials: async (difficulty = null, limit = 100, offset = 0) => {
    try {
      let url = `/api/tutorial/tutorials?limit=${limit}&offset=${offset}`;
      
      if (difficulty) url += `&difficulty=${difficulty}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建教程
  createTutorial: async (title, description, difficulty) => {
    try {
      const response = await apiClient.post(`/api/tutorial/tutorials?title=${title}&description=${description}&difficulty=${difficulty}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取教程详情
  getTutorial: async (tutorialId) => {
    try {
      const response = await apiClient.get(`/api/tutorial/tutorials/${tutorialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 更新教程
  updateTutorial: async (tutorialId, title = null, description = null, difficulty = null) => {
    try {
      let url = `/api/tutorial/tutorials/${tutorialId}`;
      const params = [];
      
      if (title) params.push(`title=${title}`);
      if (description) params.push(`description=${description}`);
      if (difficulty) params.push(`difficulty=${difficulty}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await apiClient.put(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 删除教程
  deleteTutorial: async (tutorialId) => {
    try {
      const response = await apiClient.delete(`/api/tutorial/tutorials/${tutorialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取教程步骤
  getTutorialSteps: async (tutorialId) => {
    try {
      const response = await apiClient.get(`/api/tutorial/tutorials/${tutorialId}/steps`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 创建教程步骤
  createTutorialStep: async (tutorialId, stepNumber, title, content) => {
    try {
      const response = await apiClient.post(`/api/tutorial/tutorials/${tutorialId}/steps?step_number=${stepNumber}&title=${title}&content=${content}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 更新教程步骤
  updateTutorialStep: async (stepId, stepNumber = null, title = null, content = null) => {
    try {
      let url = `/api/tutorial/tutorials/steps/${stepId}`;
      const params = [];
      
      if (stepNumber !== null) params.push(`step_number=${stepNumber}`);
      if (title) params.push(`title=${title}`);
      if (content) params.push(`content=${content}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await apiClient.put(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 删除教程步骤
  deleteTutorialStep: async (stepId) => {
    try {
      const response = await apiClient.delete(`/api/tutorial/tutorials/steps/${stepId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // 获取教程难度级别
  getDifficulties: async () => {
    try {
      const response = await apiClient.get('/api/tutorial/difficulties');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  auth: authApi,
  simulation: simulationApi,
  knowledge: knowledgeApi,
  tutorial: tutorialApi
}; 