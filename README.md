# Shift Board — a React Kanban Board

A Trello-style task board built with React 19 + Vite. Visual concept: a
foreman's paper task log — index-card task rows, a red ledger margin rule,
and rotated rubber-stamp priority badges — rendered with `IBM Plex Mono` and
`Special Elite`.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. `npm run build` produces a production
bundle in `dist/`, and `npm run preview` serves that build locally.

## Where things live

```
src/
  App.jsx                  # owns all task state, persistence, and mutations
  components/
    Board.jsx               # DndContext + column layout
    Column.jsx               # a droppable list of cards
    TaskCard.jsx             # draggable, editable, deletable card
    AddTaskForm.jsx          # text + priority intake form
    SearchBar.jsx            # live filter
  hooks/useLocalStorageState.js  # generic localStorage-backed useState
  utils/columns.js           # column + priority definitions (single source of truth)
  utils/seedData.js          # first-run sample tasks
```

## Feature checklist

**Phase 1 — Base MVP**
- [x] Three-column layout: To Do / In Progress / Done
- [x] Add task — text input + priority feeds the "To Do" state array
- [x] Delete task — works from any column
- [x] Move task — `‹ ›` buttons mutate a card's column

**Phase 2 — Priority 1**
- [x] Inline editing — click a card's text to turn it into an input; `Enter`
      saves, `Escape` cancels, blur saves
- [x] Priority system — High / Medium / Low set at creation, shown as a
      color-coded rotated stamp and a matching left border on the card
- [x] State persistence — the whole board is written to `localStorage` on
      every change and rehydrated on load, so a hard refresh doesn't lose data

**Phase 3 — Stretch**
- [x] Drag-and-drop — built with `@dnd-kit/core` + `@dnd-kit/sortable`.
      Cards can be dragged within a column to reorder, or across columns to
      change status. The `‹ ›` buttons are kept intentionally as a
      keyboard-accessible alternative to dragging, not because drag isn't
      implemented — pointer-only drag-and-drop excludes keyboard and
      screen-reader users, so both paths mutate the same underlying state.
- [x] Data filtering — the search box filters every column's rendered array
      in real time as you type (case-insensitive substring match); column
      counts show `filtered / total` while a search is active.

## Design notes

The palette, type pairing, and the stamped-priority signature element are
described in the component CSS files (`TaskCard.css` is the most opinionated
one). Fonts load from Google Fonts in `index.html`, so an internet connection
is needed the first time a page loads them.
