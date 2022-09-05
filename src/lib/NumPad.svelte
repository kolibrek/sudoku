<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { selected } from '../js/sudoku'

const dispatch = createEventDispatcher()
const handleClick = (num: number) => {
  dispatch('set', num)
}
</script>

<div class="numpad">
  {#each Array(9) as _, index}
    {@const num = index + 1}
    <button 
      on:click={() => handleClick(num)}
      class:selected={$selected && $selected.guess === num}
    >
        {num}
    </button>
  {/each}
  <button on:click={() => handleClick(0)} class="clear">Clear</button>
</div>

<style>
.numpad {
  display: grid;
  grid-template-columns: repeat(3, 48px);
  gap: 0.5rem;
  width: fit-content;
  margin: 30px auto;
}
.selected {
  color: #4fd;
}
.clear {
  grid-column: span 3;
}
</style>