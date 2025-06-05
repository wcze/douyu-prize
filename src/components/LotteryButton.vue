<script setup lang="ts">
import { computed } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';

const lotteryStore = useLotteryStore();

const isRunning = computed(() => lotteryStore.settings.isLotteryRunning);
const hasParticipants = computed(() => lotteryStore.participantCount > 0);

async function startLottery() {
  if (isRunning.value || !hasParticipants.value) return;

  lotteryStore.clearWinners();
  await lotteryStore.drawWinner();
}
</script>

<template>
  <div class="lottery-button-container">
    <button class="lottery-button" @click="startLottery" :disabled="isRunning || !hasParticipants">
      <span v-if="!isRunning">开始抽奖</span>
      <span v-else>抽奖中...</span>
    </button>
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

@media (max-width: 768px) {
  .lottery-button {
    width: 80%;
    padding: 1rem;
  }
}
</style>