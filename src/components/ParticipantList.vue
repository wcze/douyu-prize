<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';

const lotteryStore = useLotteryStore();

const participants = computed(() => lotteryStore.filteredParticipants);
const participantCount = computed(() => lotteryStore.participantCount);

const participantListRef = ref<HTMLElement | null>(null);

onMounted(() => {
  syncHeightWithRightColumn();
  window.addEventListener('resize', syncHeightWithRightColumn);
  const right = document.querySelector('.right-column') as HTMLElement;
  let lastRightHeight = right?.offsetHeight || 0;
  const observer = new MutationObserver(() => {
    const right = document.querySelector('.right-column') as HTMLElement;
    if (right && right.offsetHeight !== lastRightHeight) {
      lastRightHeight = right.offsetHeight;
      syncHeightWithRightColumn();
    }
  });
  if (right) {
    observer.observe(right, { attributes: true, childList: true, subtree: true });
  }
});

function syncHeightWithRightColumn() {
  nextTick(() => {
    const left = participantListRef.value;
    const right = document.querySelector('.right-column') as HTMLElement;
    if (left && right) {
      left.style.height = right.offsetHeight + 'px';
    }
  });
}

function removeParticipant(id: string) {
  lotteryStore.removeParticipant(id);
}

function clearAllParticipants() {
  if (confirm('确定要清空所有参与者吗？')) {
    lotteryStore.clearParticipants();
  }
}
</script>

<template>
  <div class="participant-list" ref="participantListRef">
    <div class="participant-header">
      <h3>抽奖参与者 ({{ participantCount }})</h3>
      <button class="btn-clear" @click="clearAllParticipants" :disabled="participantCount === 0">
        清空
      </button>
    </div>

    <div class="participant-grid">
      <div v-if="participantCount === 0" class="empty-state">
        <p>暂无参与者</p>
        <p class="empty-hint">请添加参与者或等待弹幕消息</p>
      </div>

      <transition-group name="participant-list" tag="div" class="participant-items">
        <div v-for="participant in participants" :key="participant.id" class="participant-item">
          <div class="participant-info">
            <img v-if="participant.avatar" :src="participant.avatar" alt="Avatar" class="participant-avatar" />
            <div class="participant-details">
              <span class="participant-name">{{ participant.username }}</span>
              <span class="participant-level">{{ participant.level == 99999 ? '[手动添加]' : 'Lv.' + participant.level
                }}</span>
            </div>
          </div>
          <button class="btn-remove" @click="removeParticipant(participant.id)">
            <span class="remove-icon">×</span>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.participant-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.participant-header {
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

.participant-grid {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 0.5rem;
  overflow-x: hidden;
}

.participant-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
}

.participant-item {
  flex: 0 0 calc(50% - 0.4rem); // 一行两个，间隙均分
  max-width: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 0.7rem;
  transition: all 0.2s;
  max-width: 100%;

  &:hover {
    background: #eeeeee;
    transform: translateY(-1px);
  }
}

.participant-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.participant-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.participant-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.5rem;
  object-fit: cover;
}

.participant-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.participant-level {
  font-size: 0.7rem;
  color: #666;
}

.btn-remove {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 0;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 0, 0, 0.1);
    color: #ff4444;
  }
}

.participant-list-enter-active,
.participant-list-leave-active {
  transition: all 0.3s ease;
}

.participant-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.participant-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 768px) {
  .participant-item {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 480px) {
  .participant-item {
    flex: 0 0 100%;
    max-width: 100%;
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
</style>