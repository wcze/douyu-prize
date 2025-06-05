<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';
import ConfettiExplosion from 'vue-confetti-explosion';

const lotteryStore = useLotteryStore();

const winners = computed(() => lotteryStore.winners);
const hasWinners = computed(() => winners.value.length > 0);
const isLotteryRunning = computed(() => lotteryStore.settings.isLotteryRunning);

// animatingUsers: { username: string, level: number, avatar?: string }[]
const animatingUsers = ref<Array<{ username: string; level: number; avatar?: string }>>([]);
const showConfetti = ref(false);
const isFullscreen = ref(false);

watch(isLotteryRunning, async (running) => {
  if (running) {
    isFullscreen.value = true;
    const users = lotteryStore.filteredParticipants.map(p => ({
      username: p.username,
      level: p.level,
      avatar: p.avatar
    }));
    animatingUsers.value = Array(lotteryStore.settings.winnerCount).fill({ username: '', level: 0 });

    const interval = setInterval(() => {
      animatingUsers.value = animatingUsers.value.map(() => {
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval);
    animatingUsers.value = [];
    showConfetti.value = true;

    setTimeout(() => {
      showConfetti.value = false;
      isFullscreen.value = false;
    }, 2000);
  }
});

function clearWinners() {
  if (confirm('确定要清空获奖记录吗？')) {
    lotteryStore.clearWinners();
  }
}

</script>

<template>
  <div class="winner-display" :class="{ 'fullscreen': isFullscreen }">
    <div class="winner-header">
      <h3>中奖名单</h3>
      <button class="btn-clear" @click="clearWinners" :disabled="!hasWinners">
        清空
      </button>
    </div>

    <div class="winner-content">
      <div v-if="!hasWinners && !isLotteryRunning" class="empty-state">
        <p>暂无中奖者</p>
        <p class="empty-hint">点击抽奖按钮开始抽奖</p>
      </div>

      <div v-else-if="isLotteryRunning" class="drawing-animation">
        <div v-for="(user, index) in animatingUsers" :key="index" class="drawing-name">
          <template v-if="user.username">
            <img v-if="user.avatar" :src="user.avatar" alt="Avatar" class="drawing-avatar" />
            <span class="drawing-username">{{ user.username }}</span>
          </template>
        </div>
      </div>

      <div v-else class="winners-list">
        <div v-for="winner in winners" :key="winner.id" class="winner-item latest-winner">
          <div class="winner-badge">
            <span>中奖</span>
          </div>

          <div class="winner-info">
            <img v-if="winner.avatar" :src="winner.avatar" alt="Avatar" class="drawing-avatar" />
            <div class="winner-details-container">
              <span class="winner-name">{{ winner.username }}</span>
              <div class="winner-details">
                <span class="winner-level">{{ winner.level == 99999 ? '[手动添加]' : 'Lv.' + winner.level }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="confetti-container" v-if="showConfetti">
      <ConfettiExplosion :particleCount="200" :force="0.3" :colors="['#2196f3', '#1976d2', '#64b5f6', '#bbdefb']" />
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
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    border-radius: 0;
    padding: 2rem;

    .drawing-animation {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .drawing-name {
      font-size: 2rem;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 6px 24px rgba(33, 150, 243, 0.12);
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
  }
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

.drawing-animation {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
}

.drawing-name {
  font-size: 2rem;
  color: #2196f3;
  text-align: center;
  animation: nameFlicker 0.3s infinite;
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
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 1rem;
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
  align-items: center;
}

.winner-details-container {
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

.drawing-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  vertical-align: middle;
}

.drawing-username {
  font-size: 2rem;
  font-weight: 700;
  color: #2196f3;
  margin-right: 0.5rem;
}

.drawing-level {
  font-size: 1.2rem;
  color: #666;
}

@keyframes nameFlicker {
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

    &.fullscreen .drawing-name {
      font-size: 2.5rem;
    }
  }

  .drawing-name {
    font-size: 1.5rem;
  }

  .drawing-avatar {
    width: 32px;
    height: 32px;
    margin-right: 0.5rem;
  }

  .drawing-username {
    font-size: 1.2rem;
  }

  .drawing-level {
    font-size: 0.9rem;
  }
}
</style>