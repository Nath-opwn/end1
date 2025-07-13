<template>
  <div class="lab-view h-full overflow-auto">
    <div class="container mx-auto px-4 py-6">
      <!-- 显示实验列表或详情 -->
      <div v-if="!selectedExperiment">
        <LabExperimentList @experiment-selected="handleExperimentSelected" />
      </div>
      <div v-else>
        <LabExperimentDetail 
          :experimentType="selectedExperiment.type" 
          @go-back="handleGoBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LabExperimentList from '../components/Lab/LabExperimentList.vue';
import LabExperimentDetail from '../components/Lab/LabExperimentDetail.vue';

// 选中的实验
const selectedExperiment = ref(null);

// 处理实验选择
function handleExperimentSelected(experiment) {
  selectedExperiment.value = experiment;
}

// 处理返回列表
function handleGoBack() {
  selectedExperiment.value = null;
}
</script> 