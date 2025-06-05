export interface Participant {
  id: string;
  username: string;
  level: number;
  timestamp: number;
}

export interface LotterySettings {
  roomId: string;
  minLevel: number;
  maxParticipants: number;
  winnerCount: number;
  animationSpeed: number;
  isLotteryRunning: boolean;
  isReadingChat: boolean;
}