// Parent game listens for honey pot earnings
window.addEventListener('message', (event) => {
  if (event.data.type === 'HONEY_EARNED') {
    honeyPotManager.add(event.data.amount);
  }
});

// Microgame iframe API
class MicrogameAPI {
  reportHoneyEarned(amount) {
    parent.postMessage({
      type: 'HONEY_EARNED',
      amount: amount,
      gameId: this.gameId
    }, '*');
  }
}