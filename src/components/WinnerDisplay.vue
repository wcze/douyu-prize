<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';
import ConfettiExplosion from 'vue-confetti-explosion';

const lotteryStore = useLotteryStore();

const winners = computed(() => lotteryStore.winners);
const hasWinners = computed(() => winners.value.length > 0);

const showConfetti = ref(false);

function clearWinners() {
  if (confirm('确定要清空获奖记录吗？')) {
    lotteryStore.clearWinners();
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
</script>

<template>
  <div class="winner-display">
    <div class="winner-header">
      <h3>中奖名单</h3>
      <button 
        class="btn-clear" 
        @click="clearWinners" 
        :disabled="!hasWinners"
      >
        清空
      </button>
    </div>
    
    <div class="winner-content">
      <div v-if="!hasWinners" class="empty-state">
        <p>暂无中奖者</p>
        <p class="empty-hint">点击抽奖按钮开始抽奖</p>
      </div>
      
      <div v-else class="winners-list">
        <div 
          v-for="(winner, index) in winners" 
          :key="winner.id"
          class="winner-item"
          :class="{ 'latest-winner': index === 0 }"
        >
          <div class="winner-badge" v-if="index === 0">
            <span>最新</span>
          </div>
          
          <div class="winner-info">
            <span class="winner-name">{{ winner.username }}</span>
            <div class="winner-details">
              <span class="winner-level">Lv.{{ winner.level }}</span>
              <span class="winner-time">{{ formatTime(winner.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="confetti-container" v-if="showConfetti">
      <ConfettiExplosion 
        :particleCount="200" 
        :force="0.3" 
        :stageWidth="1000" 
        :stageHeight="600"
        :colors="['#2196f3', '#1976d2', '#64b5f6', '#bbdefb']"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.winner-display {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.winner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
}

.btn-clear {
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.winner-content {
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  
  p {
    margin: 0.5rem 0;
  }
  
  .empty-hint {
    font-size: 0.8rem;
    opacity: 0.8;
  }
}

.winners-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.winner-item {
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s;
  
  &.latest-winner {
    background: #e3f2fd;
    animation: pulse 2s infinite;
  }
}

.winner-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #2196f3;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(33, 150, 243, 0.2);
}

.winner-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.winner-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.winner-details {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.confetti-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
}

@media (max-width: 768px) {
  .winner-display {
    padding: 1rem;
  }
}
</style>