<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';
import Ex_WebSocket_UnLogin from '../utils/douyu_ex_websocket';


const lotteryStore = useLotteryStore();

const formSettings = reactive({
  roomId: lotteryStore.settings.roomId,
  minLevel: lotteryStore.settings.minLevel,
  maxParticipants: lotteryStore.settings.maxParticipants,
  winnerCount: lotteryStore.settings.winnerCount,
  animationSpeed: lotteryStore.settings.animationSpeed,
  isReadingChat: lotteryStore.settings.isReadingChat
});

function updateSettings() {
  lotteryStore.updateSettings({
    roomId: formSettings.roomId,
    minLevel: formSettings.minLevel,
    maxParticipants: formSettings.maxParticipants,
    winnerCount: formSettings.winnerCount,
    animationSpeed: formSettings.animationSpeed,
    isReadingChat: formSettings.isReadingChat
  });
}

let wsInstance: Ex_WebSocket_UnLogin | null = null;

function toggleChatReading() {
  formSettings.isReadingChat = !formSettings.isReadingChat;

  if (formSettings.isReadingChat) {
    wsInstance = new Ex_WebSocket_UnLogin(
      lotteryStore.settings.roomId,
      (msg: string) => {
        if (formSettings.isReadingChat && msg.startsWith('type@=chatmsg')) {
          let name: string = '';
          let level: number = 1;
          let avatar: string = '';

          msg.split('/').forEach(m => {
            if (m.startsWith('nn@=')) {
              name = m.split('=')[1];
            }
            if (m.startsWith('level@=')) {
              level = parseInt(m.split('=')[1]);
            }
            if (m.startsWith('ic@=')) {
              avatar = m.split('=')[1];
              avatar = 'https://apic.douyucdn.cn/upload/' + avatar.replace(/@S/g, '/') + '_small.jpg';
            }
          });

          lotteryStore.addParticipant(name.trim(), level, avatar);
          console.log(msg);
        }
      },
      () => {
        console.error('WebSocket error');
      }
    );
  } else {
    if (wsInstance && typeof wsInstance.close === 'function') {
      wsInstance.close();
    }
    wsInstance = null;
  }

  updateSettings();
}

// Sync store changes back to form
watchEffect(() => {
  formSettings.roomId = lotteryStore.settings.roomId;
  formSettings.minLevel = lotteryStore.settings.minLevel;
  formSettings.maxParticipants = lotteryStore.settings.maxParticipants;
  formSettings.winnerCount = lotteryStore.settings.winnerCount;
  formSettings.animationSpeed = lotteryStore.settings.animationSpeed;
  formSettings.isReadingChat = lotteryStore.settings.isReadingChat;
});
</script>

<template>
  <div class="lottery-settings">
    <h3>抽奖设置</h3>

    <div class="settings-form">
      <div class="form-group">
        <label for="roomId">房间号</label>
        <input
          id="roomId"
          v-model="formSettings.roomId"
          type="text"
          placeholder="输入房间号"
          @change="updateSettings"
          :disabled="formSettings.isReadingChat"
        />
      </div>

      <div class="form-group">
        <label for="minLevel">最低用户等级</label>
        <div class="range-container">
          <input id="minLevel" v-model.number="formSettings.minLevel" type="range" min="1" max="50"
            @change="updateSettings" />
          <span class="range-value">{{ formSettings.minLevel }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="maxParticipants">最大参与人数</label>
        <div class="range-container">
          <input id="maxParticipants" v-model.number="formSettings.maxParticipants" type="range" min="10" max="500"
            step="10" @change="updateSettings" />
          <span class="range-value">{{ formSettings.maxParticipants }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="winnerCount">中奖人数</label>
        <div class="range-container">
          <input id="winnerCount" v-model.number="formSettings.winnerCount" type="range" min="1" max="10"
            @change="updateSettings" />
          <span class="range-value">{{ formSettings.winnerCount }}</span>
        </div>
      </div>

      <button class="btn-toggle-chat" :class="{ active: formSettings.isReadingChat }" @click="toggleChatReading">
        {{ formSettings.isReadingChat ? '停止读取弹幕' : '开始读取弹幕' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lottery-settings {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    color: #333;
  }
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #666;
  }

  input[type="text"] {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0.8rem 1rem;
    color: #333;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2196f3;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #2196f3;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
      }
    }
  }
}

.range-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.btn-toggle-chat {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.8rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background: #eeeeee;
  }

  &.active {
    background: #2196f3;
    color: white;
    border-color: #2196f3;

    &:hover {
      background: #1976d2;
    }
  }
}

@media (max-width: 768px) {
  .lottery-settings {
    padding: 1rem;
  }
}
</style>