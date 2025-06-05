<script setup lang="ts">
import { onMounted } from 'vue';
import { useLotteryStore } from './store/lotteryStore';
import ParticipantList from './components/ParticipantList.vue';
import AddParticipant from './components/AddParticipant.vue';
import LotterySettings from './components/LotterySettings.vue';
import LotteryButton from './components/LotteryButton.vue';
import WinnerDisplay from './components/WinnerDisplay.vue';



// Create store instance
const lotteryStore = useLotteryStore();

// API function to be exposed for external use
function addUser(username: string, level = 1) {
  return lotteryStore.addParticipant(username, level);
}

// Expose the addUser function to the window object for external access
onMounted(() => {
  window.addUser = addUser;
});
</script>

<template>
  <div class="app-container">

    <main class="app-content">
      <div class="left-column">
        <ParticipantList />
      </div>

      <div class="right-column">
        <div class="controls-section">
          <AddParticipant />
          <LotterySettings />
        </div>

        <LotteryButton />

        <div class="winner-section">
          <WinnerDisplay />
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <header class="app-header">
        <img src="/logo.png" alt="">
        <h1>斗鱼弹幕抽奖</h1>
      </header>
      <p>© wcze <a target="_blank" href="https://github.com/wcze/douyu-prize"><svg style="width: 1.2em;"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z">
            </path>
          </svg> GitHub</a></p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.app-header {
  padding: 0rem 3rem;
  display: flex;
  justify-content: flex-start;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(45deg, #1976d2, #2196f3);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 0 2px 10px rgba(33, 150, 243, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    vertical-align: middle;
    margin-right: 1rem;
    border-radius: 50%;
  }
}

.app-content {
  flex: 1;
  display: flex;
  padding: 2rem;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  align-items: stretch;
  position: relative;
}

.left-column {
  width: 40%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%; 
  overflow: hidden;
}

.right-column {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
  height: 100%;
  min-height: 0;
}

.controls-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.winner-section {
  flex: 1;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: #666;
    text-decoration: none;
  }
}

@media (max-width: 1200px) {
  .app-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .controls-section {
    gap: 1.5rem;
  }
}

@media (max-width: 992px) {
  .app-header {
    padding: 1.5rem;

    h1 {
      font-size: 1.8rem;
    }
  }

  .app-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .controls-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .app-header {
    text-align: center;

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>