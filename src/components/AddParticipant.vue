<script setup lang="ts">
import { ref } from 'vue';
import { useLotteryStore } from '../store/lotteryStore';

const lotteryStore = useLotteryStore();

const username = ref('');

function addParticipant() {
  if (username.value.trim()) {
    const success = lotteryStore.addParticipant(username.value.trim(), 99999);
    if (success) {
      username.value = '';
    }
  }
}
</script>

<template>
  <div class="add-participant">
    <h3>手动添加参与者</h3>
    
    <div class="add-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          id="username" 
          v-model="username" 
          type="text" 
          placeholder="输入用户名"
          @keyup.enter="addParticipant"
        />
      </div>
      
      <button 
        class="btn-add" 
        @click="addParticipant" 
        :disabled="!username.trim()"
      >
        添加参与者
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-participant {
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

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.9rem;
    color: #666;
  }
  
  input {
    background: #ffffff;
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
    
    &::placeholder {
      color: #999;
    }
  }
}

.btn-add {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
  
  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .add-participant {
    padding: 1rem;
  }
}
</style>