import api from './api';

/**
 * 实验类型枚举
 */
export enum LabExperimentType {
  STATIC_PRESSURE = 'static_pressure',           // 静水压强实验
  FLUID_STATICS = 'fluid_statics',               // 流体静力学综合实验
  REYNOLDS = 'reynolds',                         // 雷诺实验
  BERNOULLI = 'bernoulli',                       // 伯努利方程验证实验
  VENTURI = 'venturi',                           // 文丘里流量计实验
  FRICTION_LOSS = 'friction_loss',               // 沿程阻力实验
  LOCAL_LOSS = 'local_loss',                     // 局部阻力实验
  MOMENTUM = 'momentum',                         // 动量定律实验
  KARMAN_VORTEX = 'karman_vortex',               // 卡门涡街实验
  BOUNDARY_LAYER = 'boundary_layer',             // 平板边界层速度剖面测量
  HYDRAULIC_JUMP = 'hydraulic_jump',             // 水跃综合实验
  CYLINDER_PRESSURE = 'cylinder_pressure',       // 圆柱绕流表面压力分布实验
  BERNOULLI_LEVITATOR = 'bernoulli_levitator',   // 伯努利悬浮器实验
  HYPERELASTIC = 'hyperelastic'                  // 超弹性现象演示
}

/**
 * 实验参数接口
 */
export interface LabExperimentParams {
  [key: string]: any;
}

/**
 * 实验数据响应接口
 */
export interface LabExperimentData {
  id: string;
  type: LabExperimentType;
  name: string;
  description: string;
  created_at: string;
  parameters: LabExperimentParams;
  results: {
    [key: string]: any;
  };
  visualization_data?: {
    [key: string]: any;
  };
}

/**
 * 实验会话接口
 */
export interface LabSession {
  id: string;
  userId: string;
  experimentType: LabExperimentType;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  parameters: LabExperimentParams;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

/**
 * 实验服务
 */
const labService = {
  /**
   * 获取所有可用实验
   */
  async getAvailableExperiments(): Promise<{ type: LabExperimentType, name: string, description: string }[]> {
    const response = await api.get<any, { type: LabExperimentType, name: string, description: string }[]>('/api/lab/experiments');
    return response;
  },
  
  /**
   * 创建实验会话
   * @param experimentType 实验类型
   * @param name 实验名称
   * @param description 实验描述
   * @param parameters 实验参数
   */
  async createSession(
    experimentType: LabExperimentType,
    name: string,
    description: string,
    parameters: LabExperimentParams
  ): Promise<LabSession> {
    const response = await api.post<any, LabSession>('/api/lab/sessions', {
      experimentType,
      name,
      description,
      parameters
    });
    return response;
  },
  
  /**
   * 获取用户的实验会话列表
   */
  async getUserSessions(): Promise<LabSession[]> {
    const response = await api.get<any, LabSession[]>('/api/lab/sessions/user');
    return response;
  },
  
  /**
   * 获取实验会话详情
   * @param sessionId 会话ID
   */
  async getSession(sessionId: string): Promise<LabSession> {
    const response = await api.get<any, LabSession>(`/api/lab/sessions/${sessionId}`);
    return response;
  },
  
  /**
   * 更新实验会话参数
   * @param sessionId 会话ID
   * @param parameters 实验参数
   */
  async updateSessionParameters(sessionId: string, parameters: LabExperimentParams): Promise<LabSession> {
    const response = await api.put<any, LabSession>(`/api/lab/sessions/${sessionId}/parameters`, parameters);
    return response;
  },
  
  /**
   * 运行实验
   * @param sessionId 会话ID
   */
  async runExperiment(sessionId: string): Promise<{ jobId: string }> {
    const response = await api.post<any, { jobId: string }>(`/api/lab/sessions/${sessionId}/run`);
    return response;
  },
  
  /**
   * 获取实验结果
   * @param sessionId 会话ID
   */
  async getExperimentResults(sessionId: string): Promise<LabExperimentData> {
    const response = await api.get<any, LabExperimentData>(`/api/lab/sessions/${sessionId}/results`);
    return response;
  },
  
  /**
   * 获取实验状态
   * @param sessionId 会话ID
   */
  async getExperimentStatus(sessionId: string): Promise<{ status: 'pending' | 'running' | 'completed' | 'failed', progress?: number }> {
    const response = await api.get<any, { status: 'pending' | 'running' | 'completed' | 'failed', progress?: number }>(`/api/lab/sessions/${sessionId}/status`);
    return response;
  },
  
  /**
   * 取消实验
   * @param sessionId 会话ID
   */
  async cancelExperiment(sessionId: string): Promise<void> {
    await api.post(`/api/lab/sessions/${sessionId}/cancel`);
  },
  
  /**
   * 获取实验配置选项
   * @param experimentType 实验类型
   */
  async getExperimentConfiguration(experimentType: LabExperimentType): Promise<{ parameters: { name: string, type: string, default: any, range?: [number, number], options?: string[] }[] }> {
    const response = await api.get<any, { parameters: { name: string, type: string, default: any, range?: [number, number], options?: string[] }[] }>(`/api/lab/experiments/${experimentType}/configuration`);
    return response;
  },
  
  /**
   * 获取实验可视化数据
   * @param sessionId 会话ID
   * @param dataType 数据类型（如 'velocity', 'pressure' 等）
   */
  async getVisualizationData(sessionId: string, dataType: string): Promise<any> {
    const response = await api.get<any, any>(`/api/lab/sessions/${sessionId}/visualization/${dataType}`);
    return response;
  }
};

export default labService; 