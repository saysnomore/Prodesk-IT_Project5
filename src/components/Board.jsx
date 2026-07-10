import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import Column from "./Column.jsx";
import TaskCard from "./TaskCard.jsx";
import { COLUMNS } from "../utils/columns.js";
import "./Board.css";

export default function Board({
  tasksByColumn,
  fullCountByColumn,
  onDragEnd,
  onDelete,
  onEdit,
  onMove,
}) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findTask(taskId) {
    for (const col of COLUMNS) {
      const found = tasksByColumn[col.id].find((t) => t.id === taskId);
      if (found) return found;
    }
    return null;
  }

  function handleDragStart(event) {
    setActiveTask(findTask(event.active.id));
  }

  function handleDragEnd(event) {
    setActiveTask(null);
    onDragEnd(event);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="board">
        {COLUMNS.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            columnIndex={index}
            columnCount={COLUMNS.length}
            tasks={tasksByColumn[column.id]}
            totalCount={fullCountByColumn[column.id]}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <TaskCard
              task={activeTask}
              columnId=""
              columnIndex={0}
              columnCount={COLUMNS.length}
              onDelete={() => {}}
              onEdit={() => {}}
              onMove={() => {}}
            />
          </ul>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
