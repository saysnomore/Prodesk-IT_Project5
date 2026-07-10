import { useState } from "react";
import { PRIORITIES } from "../utils/columns.js";
import "./AddTaskForm.css";

export default function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText("");
    setPriority("Medium");
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <label className="add-task__label" htmlFor="new-task-text">
        Log a new task
      </label>
      <div className="add-task__row">
        <input
          id="new-task-text"
          type="text"
          className="add-task__input"
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          className="add-task__priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button type="submit" className="add-task__submit">
          File it →
        </button>
      </div>
    </form>
  );
}
