import { useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Board from "./components/Board.jsx";
import AddTaskForm from "./components/AddTaskForm.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { COLUMNS } from "./utils/columns.js";
import { SEED_TASKS, createId } from "./utils/seedData.js";
import "./App.css";

const STORAGE_KEY = "shift-board-tasks-v1";

function findColumnIdOfTask(tasks, taskId) {
  return COLUMNS.find((col) => tasks[col.id].some((t) => t.id === taskId))?.id ?? null;
}

export default function App() {
  const [tasks, setTasks] = useLocalStorageState(STORAGE_KEY, SEED_TASKS);
  const [search, setSearch] = useState("");

  const totalTaskCount = useMemo(
    () => COLUMNS.reduce((sum, col) => sum + tasks[col.id].length, 0),
    [tasks]
  );

  const filteredByColumn = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = {};
    for (const col of COLUMNS) {
      result[col.id] = query
        ? tasks[col.id].filter((t) => t.text.toLowerCase().includes(query))
        : tasks[col.id];
    }
    return result;
  }, [tasks, search]);

  const fullCountByColumn = useMemo(() => {
    const result = {};
    for (const col of COLUMNS) result[col.id] = tasks[col.id].length;
    return result;
  }, [tasks]);

  // ---- Phase 1: Add ----
  function addTask(text, priority) {
    const newTask = { id: createId(), text, priority };
    setTasks((prev) => ({ ...prev, todo: [...prev.todo, newTask] }));
  }

  // ---- Phase 1: Delete (works from any column) ----
  function deleteTask(taskId) {
    setTasks((prev) => {
      const next = {};
      for (const col of COLUMNS) {
        next[col.id] = prev[col.id].filter((t) => t.id !== taskId);
      }
      return next;
    });
  }

  // ---- Phase 2: Inline edit ----
  function editTask(taskId, newText) {
    setTasks((prev) => {
      const next = {};
      for (const col of COLUMNS) {
        next[col.id] = prev[col.id].map((t) => (t.id === taskId ? { ...t, text: newText } : t));
      }
      return next;
    });
  }

  // ---- Phase 1: Move via buttons (accessible alternative to drag) ----
  function moveTaskToColumnIndex(taskId, targetIndex) {
    if (targetIndex < 0 || targetIndex >= COLUMNS.length) return;
    const targetColumnId = COLUMNS[targetIndex].id;
    setTasks((prev) => {
      const sourceColumnId = findColumnIdOfTask(prev, taskId);
      if (!sourceColumnId || sourceColumnId === targetColumnId) return prev;
      const task = prev[sourceColumnId].find((t) => t.id === taskId);
      return {
        ...prev,
        [sourceColumnId]: prev[sourceColumnId].filter((t) => t.id !== taskId),
        [targetColumnId]: [...prev[targetColumnId], task],
      };
    });
  }

  // ---- Phase 3: Drag-and-drop across / within columns ----
  function handleDragEnd({ active, over }) {
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    setTasks((prev) => {
      const sourceColumnId = findColumnIdOfTask(prev, activeId);
      const overIsColumn = COLUMNS.some((c) => c.id === overId);
      const targetColumnId = overIsColumn ? overId : findColumnIdOfTask(prev, overId);
      if (!sourceColumnId || !targetColumnId) return prev;

      const sourceList = prev[sourceColumnId];
      const activeIndex = sourceList.findIndex((t) => t.id === activeId);

      // Reordering within the same column
      if (sourceColumnId === targetColumnId) {
        const targetList = prev[targetColumnId];
        const overIndex = overIsColumn ? targetList.length - 1 : targetList.findIndex((t) => t.id === overId);
        return {
          ...prev,
          [targetColumnId]: arrayMove(targetList, activeIndex, Math.max(overIndex, 0)),
        };
      }

      // Moving across columns
      const task = sourceList[activeIndex];
      const nextSource = sourceList.filter((t) => t.id !== activeId);
      const targetList = prev[targetColumnId];
      const overIndex = overIsColumn ? targetList.length : targetList.findIndex((t) => t.id === overId);
      const insertAt = overIndex === -1 ? targetList.length : overIndex;
      const nextTarget = [...targetList.slice(0, insertAt), task, ...targetList.slice(insertAt)];

      return {
        ...prev,
        [sourceColumnId]: nextSource,
        [targetColumnId]: nextTarget,
      };
    });
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-top">
          <h1 className="app__title">Shift Board</h1>
          <span className="app__subtitle">— task log · {totalTaskCount} on file —</span>
        </div>
      </header>

      <main className="app__main">
        <AddTaskForm onAdd={addTask} />
        <SearchBar value={search} onChange={setSearch} />
        <Board
          tasksByColumn={filteredByColumn}
          fullCountByColumn={fullCountByColumn}
          onDragEnd={handleDragEnd}
          onDelete={deleteTask}
          onEdit={editTask}
          onMove={moveTaskToColumnIndex}
        />
      </main>

      <footer className="app__footer">
        Drag a card by its ⠿ handle, or use ‹ › to move it — everything saves to this browser automatically.
      </footer>
    </div>
  );
}
