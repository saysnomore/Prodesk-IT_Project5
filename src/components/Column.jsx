import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";
import "./Column.css";

export default function Column({
  column,
  columnIndex,
  columnCount,
  tasks,
  totalCount,
  onDelete,
  onEdit,
  onMove,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      className="column"
      style={{ "--accent": `var(${column.accentVar})` }}
      aria-labelledby={`column-${column.id}-heading`}
    >
      <header className="column__header">
        <h2 id={`column-${column.id}-heading`} className="column__title">
          {column.title}
        </h2>
        <span className="column__count">
          {tasks.length}
          {tasks.length !== totalCount ? ` / ${totalCount}` : ""}
        </span>
      </header>

      <ul
        ref={setNodeRef}
        className={`column__list${isOver ? " column__list--over" : ""}`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && (
            <li className="column__empty" aria-hidden="true">
              {totalCount === 0 ? "— nothing filed yet —" : "— no matches —"}
            </li>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              columnIndex={columnIndex}
              columnCount={columnCount}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
            />
          ))}
        </SortableContext>
      </ul>
    </section>
  );
}
