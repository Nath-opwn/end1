<template>
  <div class="knowledge-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">知识库</h2>
      <div class="flex space-x-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="搜索知识..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="search"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          v-if="isAdmin"
          @click="$emit('create-new')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          创建新知识
        </button>
      </div>
    </div>
    
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        @click="selectCategory(null)"
        :class="[
          'px-3 py-1 rounded-full text-sm',
          selectedCategory === null 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        全部
      </button>
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="[
          'px-3 py-1 rounded-full text-sm',
          selectedCategory === category 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ category }}
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else-if="knowledgeItems.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p class="text-gray-600 mb-4">没有找到相关知识</p>
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in knowledgeItems"
        :key="item.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-semibold">{{ item.title }}</h3>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{{ item.category }}</span>
          </div>
          
          <p class="text-gray-600 mb-4 line-clamp-3">{{ item.content }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="(tag, index) in getTags(item.tags)" 
              :key="index"
              class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">{{ formatDate(item.created_at) }}</span>
            <button
              @click="$emit('view-item', item)"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              阅读全文
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="knowledgeItems.length > 0 && hasMore" class="mt-6 text-center">
      <button
        @click="loadMore"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="loadingMore"
      >
        {{ loadingMore ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { knowledgeApi } from '../../api/fluidDynamicsApi';

export default {
  name: 'KnowledgeList',
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['create-new', 'view-item'],
  
  setup() {
    const knowledgeItems = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const error = ref('');
    const offset = ref(0);
    const limit = ref(9);
    const hasMore = ref(true);
    const selectedCategory = ref(null);
    const searchTerm = ref('');
    
    const fetchCategories = async () => {
      try {
        const response = await knowledgeApi.getCategories();
        categories.value = response;
      } catch (err) {
        console.error('获取分类失败:', err);
      }
    };
    
    const fetchKnowledgeItems = async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          loadingMore.value = true;
        } else {
          loading.value = true;
          offset.value = 0;
        }
        
        error.value = '';
        
        const response = await knowledgeApi.getItems(
          selectedCategory.value,
          null,
          limit.value,
          offset.value
        );
        
        if (isLoadMore) {
          knowledgeItems.value = [...knowledgeItems.value, ...response.items];
        } else {
          knowledgeItems.value = response.items;
        }
        
        // 更新分页信息
        hasMore.value = response.items.length === limit.value;
        if (hasMore.value) {
          offset.value += limit.value;
        }
      } catch (err) {
        console.error('获取知识项列表失败:', err);
        error.value = '获取知识项列表失败，请稍后重试';
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };
    
    const loadMore = () => {
      fetchKnowledgeItems(true);
    };
    
    const selectCategory = (category) => {
      selectedCategory.value = category;
      fetchKnowledgeItems();
    };
    
    const search = () => {
      // 实际项目中，这里应该调用搜索API
      // 目前简单实现为重新获取数据
      fetchKnowledgeItems();
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    const getTags = (tagsString) => {
      if (!tagsString) return [];
      return tagsString.split(',').map(tag => tag.trim());
    };
    
    watch(selectedCategory, () => {
      fetchKnowledgeItems();
    });
    
    onMounted(() => {
      fetchCategories();
      fetchKnowledgeItems();
    });
    
    return {
      knowledgeItems,
      categories,
      loading,
      loadingMore,
      error,
      hasMore,
      selectedCategory,
      searchTerm,
      loadMore,
      selectCategory,
      search,
      formatDate,
      getTags
    };
  }
};
</script> 