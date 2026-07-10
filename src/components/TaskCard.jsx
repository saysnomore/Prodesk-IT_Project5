import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";

const PRIORITY_LABEL = {
  High: "HIGH",
  Medium: "MED",
  Low: "LOW",
};

export default function TaskCard({
  task,
  columnId,
  columnIndex,
  columnCount,
  onDelete,
  onEdit,
  onMove,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const inputRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function commitEdit() {
    const trimmed = draftText.trim();
    if (trimmed.length === 0) {
      setDraftText(task.text); // discard empty edits, keep original text
    } else {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setDraftText(task.text);
      setIsEditing(false);
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`task-card task-card--${task.priority.toLowerCase()}`}
    >
      <div className="task-card__drag-handle" {...attributes} {...listeners} aria-label="Drag to move task">
        ⠿
      </div>

      <span className={`task-card__stamp task-card__stamp--${task.priority.toLowerCase()}`}>
        {PRIORITY_LABEL[task.priority]}
      </span>

      <div className="task-card__body">
        {isEditing ? (
          <input
            ref={inputRef}
            className="task-card__edit-input"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            aria-label="Edit task text"
          />
        ) : (
          <button
            type="button"
            className="task-card__text"
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {task.text}
          </button>
        )}
      </div>

      <div className="task-card__controls">
        <div className="task-card__move-group" role="group" aria-label="Move task to another column">
          <button
            type="button"
            className="task-card__move-btn"
            onClick={() => onMove(task.id, columnIndex - 1)}
            disabled={columnIndex === 0}
            aria-label="Move to previous column"
          >
            ‹
          </button>
          <button
            type="button"
            className="task-card__move-btn"
            onClick={() => onMove(task.id, columnIndex + 1)}
            disabled={columnIndex === columnCount - 1}
            aria-label="Move to next column"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          className="task-card__delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          VOID
        </button>
      </div>
    </li>
  );
}
