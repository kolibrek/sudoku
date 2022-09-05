<script lang="ts">
import type { Coord } from '../js/sudoku'
import { selected } from '../js/sudoku'

export let guess: number
export let answer: number
export let position: Coord
export let hidden: boolean
export let match: boolean
</script>

<button class="cell"
  title={`${position.i},${position.j}: ${guess}`}
  class:selected={$selected && $selected.position === position}
  class:hidden
  class:match
  on:click
  on:dblclick={() => console.log(answer)}
>
  {#if hidden}
    {guess ? guess : ''}
  {:else}
    {answer}
  {/if}
</button>

<style>
.cell {
  border: 1px solid #fff;
  border-radius: 0;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.4em;
  padding: 0;
}
.cell:hover {
  z-index: 5;
  outline: 5px solid #29cea4;
}
.cell.match {
  background-color: #662222;
}
.cell.selected {
  background-color: #197;
}
.cell.hidden {
  color: #44ffdd;
}
.cell.hidden.selected {
  color: rgb(191, 255, 251);
}
.cell:not(.hidden) {
  font-weight: 400;
}
</style>