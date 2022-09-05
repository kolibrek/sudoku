import { writable, get } from "svelte/store"
import { difference, shuffle, sortedUniq, sortedUniqBy, times } from "lodash"

export interface Coord {
  i: number
  j: number
}

export interface ICell {
  position: Coord
  answer: number
  guess: number
  neighbors: Coord[]
  hidden: boolean
}

export const sqrt = 3
export const size = sqrt * sqrt
export const total = size * size
export const difficulty = writable(0.5)
const validValues = [1,2,3,4,5,6,7,8,9]

export const selected = writable<ICell>(undefined)

export const cells = writable<ICell[]>(times(total, (index) => {
  const position = resolvePosition(index)
  const neighbors = getNeighbors(position)
  const hidden = Math.random() > get(difficulty)

  return { position, answer: undefined, guess: 0, neighbors, hidden }
}))

export function at(c: Coord): number {
  return c.j * size + c.i
}

export function setCell(c: Coord, cell: ICell) {
  cells.update(value => {
    value[at(c)] = cell
    return value
  })
}

function resolvePosition(index: number): Coord {
  return { i: (index % size), j: Math.floor(index / size) }
}

function getNeighbors(position: Coord): Coord[] {
  const iBase = Math.floor(position.i / sqrt) * sqrt
  const jBase = Math.floor(position.j / sqrt) * sqrt

  const blockNeighbors: Coord[] = []
  times(size, (index) => {
    const i = Math.floor(index / sqrt) + iBase
    const j = (index % sqrt) + jBase

    if (i !== position.i || j !== position.j) {
      blockNeighbors.push({i, j})
    }
  })

  const rowNeighbors: Coord[] = times(size, i => (
    { i, j: position.j }
  ))
  rowNeighbors.splice(position.i, 1)

  const colNeighbors: Coord[] = times(size, j => (
    { i: position.i, j }
  ))
  colNeighbors.splice(position.j, 1)

  return sortedUniqBy([
    ...rowNeighbors,
    ...colNeighbors,
    ...blockNeighbors,
  ], c => `${c.i}:${c.j}`)
}

function doFillCells(index: number) {
  cells.update(value => {
    const cell = value[index]
    const neighborValues = sortedUniq(cell.neighbors.map(n => value[at(n)].answer))
    const remainingOptions = difference(validValues, neighborValues)

    cell.answer = shuffle(remainingOptions)[0]

    return value
  })
}

function invalidBoard(): boolean {
  const invalid = get(cells).findIndex(cell => (
    cell.answer === undefined
  )) 
  return invalid !== -1
}

export function clearBoard() {
  cells.update(value => {
    value.forEach(cell => {
      cell.answer = undefined
      cell.guess = undefined
    })
    return value
  })
}

function fill() {
  let attempts = 0
  while(invalidBoard() && attempts < 10) {
    times(total, i => {
      doFillCells(i)
    })
    attempts++
  }
}

export function attemptFills() {
  let refreshes = 0
  do {
    clearBoard()
    fill()
    refreshes++
  } while (invalidBoard() && refreshes < 100)
  console.log(refreshes)
}

function findHiddenCells(): ICell[] {
  return get(cells).filter(c => c.hidden)
}

export function findCellsWithNumber(n: number): ICell[] {
  return get(cells).filter(c => {
    return (
      (c.hidden && c.guess === n) ||
      (!c.hidden && c.answer === n)
    )
  })
}

export function checkForWin(): boolean {
  const correctGuesses = get(cells).filter(c => {
    return c.hidden && c.guess === c.answer
  })
  return correctGuesses.length === findHiddenCells().length
}