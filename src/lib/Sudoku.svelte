<script lang="ts">
import { onDestroy, onMount, createEventDispatcher } from 'svelte'
import type { Coord, ICell } from '../js/sudoku'
import {
  sqrt, size, cells, selected, clearBoard,
  at, setCell, attemptFills, checkForWin, findCellsWithNumber
} from '../js/sudoku'
import Cell from './Cell.svelte'
import NumPad from './NumPad.svelte'

const dispatch = createEventDispatcher()

let matches: ICell[] = []

const checkMatches = () => {
  matches = []
  if (!$selected)
    return
  if ($selected.hidden && $selected.guess) {
    matches = findCellsWithNumber($selected.guess)
  }
  if (!$selected.hidden) {
    matches = findCellsWithNumber($selected.answer)
  }
}

const setGuess = (num: number) => {
  $selected.guess = num
  setCell($selected.position, $selected)
  if (checkForWin())
    dispatch('win')
  else
    checkMatches()
}

const handleSelect = (c: Coord) => {
  selected.set($cells[at(c)])
  checkMatches()
}

const handleKeyUp = ({ key }: KeyboardEvent) => {
  if (/[1-9]/.test(key) && $selected) {
    setGuess(Number.parseInt(key))
  }
  if (key === 'Backspace')
    setGuess(0)
}

const handleClick = (event: CustomEvent<number>) => {
  setGuess(event.detail)
}

onMount(() => {
  clearBoard()
  attemptFills()
  document.body.addEventListener('keyup', handleKeyUp)
})
onDestroy(() => {
  document.body.removeEventListener('keyup', handleKeyUp)
})
</script>

<div class="sudoku">
  <div class="blocks" style:--sqrt={sqrt}>
    {#each Array(size) as _}
      <div class="block" />
    {/each}
  </div>
  <div class="borders-horizontal">
    {#each Array(sqrt - 1) as _}
      <div class="horizontal" />
    {/each}
  </div>
  <div class="borders-vertical">
    {#each Array(sqrt - 1) as _}
      <div class="vertical" />
    {/each}
  </div>
  <div class="grid" style:--size={size}>
    {#each $cells as cell}
      <Cell
        position={cell.position}
        answer={cell.answer}
        guess={cell.guess}
        hidden={cell.hidden}
        match={matches.findIndex(c => c.position === cell.position) !== -1}
        on:click={() => handleSelect(cell.position)}
      />
    {/each}
  </div>
</div>
<NumPad on:set={handleClick} />

<style>
.sudoku {
  position: relative;
  width: max-content;
}
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--size), 48px);
  grid-auto-rows: 48px;
  width: 100%;
}
.blocks {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--sqrt), 1fr);
}
.blocks .block:nth-child(even) {
  background-color: #444;
}
.borders-vertical,
.borders-horizontal {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: space-evenly;
}
.borders-horizontal {
  flex-direction: column;
}
.vertical,
.horizontal {
  background-color: #fff;
}
.vertical {
  width: 4px;
  height: 100%;
}
.horizontal {
  height: 4px;
  width: 100%;
}
</style>