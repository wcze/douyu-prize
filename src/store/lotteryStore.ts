import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Participant, LotterySettings } from '../types';

export const useLotteryStore = defineStore('lottery', () => {
  // State
  const participants = ref<Participant[]>([]);
  const winners = ref<Participant[]>([]);
  const settings = ref<LotterySettings>({
    roomId: '',
    minLevel: 1,
    maxParticipants: 100,
    winnerCount: 1,
    animationSpeed: 300,
    isLotteryRunning: false,
    isReadingChat: false
  });
  
  // Getters
  const filteredParticipants = computed(() => {
    return participants.value.filter(p => p.level >= settings.value.minLevel);
  });

  const participantCount = computed(() => filteredParticipants.value.length);
  
  // Actions
  function addParticipant(username: string, level: number = 1) {
    const existingParticipant = participants.value.find(p => p.username === username);
    
    if (!existingParticipant && participants.value.length < settings.value.maxParticipants) {
      const newParticipant: Participant = {
        id: generateId(),
        username,
        level,
        timestamp: Date.now()
      };
      
      participants.value.push(newParticipant);
      return true;
    }
    
    return false;
  }
  
  function removeParticipant(id: string) {
    const index = participants.value.findIndex(p => p.id === id);
    if (index !== -1) {
      participants.value.splice(index, 1);
    }
  }
  
  function clearParticipants() {
    participants.value = [];
  }
  
  async function drawWinner() {
    if (filteredParticipants.value.length === 0) return null;
    
    settings.value.isLotteryRunning = true;
    
    // Simulate drawing process
    return new Promise<Participant>((resolve) => {
      setTimeout(() => {
        const eligibleParticipants = filteredParticipants.value;
        const winnerCount = Math.min(settings.value.winnerCount, eligibleParticipants.length);
        const selectedWinners: Participant[] = [];
        
        // Select multiple winners without duplicates
        while (selectedWinners.length < winnerCount) {
          const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
          const winner = eligibleParticipants[randomIndex];
          
          if (!selectedWinners.find(w => w.id === winner.id)) {
            selectedWinners.push(winner);
          }
        }
        
        // Add winners to the winners list
        winners.value.unshift(...selectedWinners);
        settings.value.isLotteryRunning = false;
        resolve(selectedWinners[0]); // Return first winner for animation
      }, 3000); // Animation time
    });
  }
  
  function updateSettings(newSettings: Partial<LotterySettings>) {
    settings.value = { ...settings.value, ...newSettings };
  }
  
  function clearWinners() {
    winners.value = [];
  }
  
  // Helper function to generate unique IDs
  function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  return {
    participants,
    winners,
    settings,
    filteredParticipants,
    participantCount,
    addParticipant,
    removeParticipant,
    clearParticipants,
    drawWinner,
    updateSettings,
    clearWinners
  };
});