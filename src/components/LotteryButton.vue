<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';

const lotteryStore = useLotteryStore();

const isRunning = computed(() => lotteryStore.settings.isLotteryRunning);
const hasParticipants = computed(() => lotteryStore.participantCount > 0);
const showAnimation = ref(false);
const showWinner = ref(false);
const animationText = ref('');
const winnerName = ref('');

async function startLottery() {
  if (isRunning.value || !hasParticipants.value) return;
  
  showWinner.value = false;
  animationText.value = '';
  
  const usernames = lotteryStore.filteredParticipants.map(p => p.username);
  
  showAnimation.value = true;
  
  const interval = Math.max(50, lotteryStore.settings.animationSpeed / 10);
  const timer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * usernames.length);
    animationText.value = usernames[randomIndex];
  }, interval);
  
  const winner = await lotteryStore.drawWinner();
  
  clearInterval(timer);
  
  if (winner) {
    winnerName.value = winner.username;
    await new Promise(resolve => setTimeout(resolve, 500));
    showWinner.value = true;
    
    setTimeout(() => {
      showAnimation.value = false;
    }, 3000);
  }
}
</script>

<template>
  <div class="lottery-button-container">
    <button 
      class="lottery-button" 
      @click="startLottery" 
      :disabled="isRunning || !hasParticipants"
    >
      <span v-if="!isRunning">开始抽奖</span>
      <span v-else>抽奖中...</span>
    </button>
    
    <transition name="fade">
      <div v-if="showAnimation" class="lottery-animation">
        <div class="animation-content">
          <div class="animation-text">{{ animationText }}</div>
          <transition name="zoom">
            <div v-if="showWinner" class="winner-announcement">
              <div class="winner-text">恭喜</div>
              <div class="winner-name">{{ winnerName }}</div>
              <div class="winner-text">中奖！</div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.lottery-button-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}

.lottery-button {
  position: relative;
  z-index: 2;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: #1976d2;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.lottery-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
}

.animation-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  height: 300px;
}

.animation-text {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  text-shadow: 0 0 10px rgba(33, 150, 243, 0.2);
  animation: textFlicker 0.2s infinite;
}

.winner-announcement {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

.winner-text {
  font-size: 2rem;
  color: #ffc107;
  margin: 0.5rem 0;
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
}

.winner-name {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #1976d2, #2196f3);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin: 1rem 0;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: winnerPulse 2s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

@keyframes textFlicker {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes winnerPulse {
  0% {
    text-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
  }
  50% {
    text-shadow: 0 0 30px rgba(33, 150, 243, 0.5);
  }
  100% {
    text-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
  }
}

@media (max-width: 768px) {
  .lottery-button {
    width: 80%;
    padding: 1rem;
  }
  
  .animation-text,
  .winner-name {
    font-size: 2rem;
  }
  
  .winner-text {
    font-size: 1.5rem;
  }
}
</style>