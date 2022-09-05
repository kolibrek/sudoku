<script lang="ts">
import Sudoku from './lib/Sudoku.svelte'
import Modal from './lib/Modal.svelte'

let hasWon = false
let games = 0

const reset = () => {
  games = games + 1
  hasWon = false
}
</script>

<main>
  <h1>Sudoku</h1>
  {#key games}
    <Sudoku on:win={() => hasWon = true} />
  {/key}
  {#if hasWon}
    <Modal on:click={reset} />
  {/if}
</main>
