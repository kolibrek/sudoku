<div class="backdrop">
  <div class="card">
    <h1>You Won!</h1>
    <button on:click>Reset</button>
  </div>
</div>

<style>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: #0008;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: fit-content;
  padding: 2rem;
  background-color: #3338;
  backdrop-filter: blur(6px);
  border: 1px solid #6668;
  border-radius: 1rem;
}
</style>