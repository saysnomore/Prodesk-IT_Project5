export function createId() {
  // Timestamp + random suffix is unique enough for a client-only board
  // and avoids pulling in a uuid dependency for this scope.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const SEED_TASKS = {
  todo: [
    { id: createId(), text: "Wire up the intake form", priority: "High" },
    { id: createId(), text: "Sketch column layout on whiteboard", priority: "Low" },
  ],
  inProgress: [
    { id: createId(), text: "Refactor card component props", priority: "Medium" },
  ],
  done: [
    { id: createId(), text: "Scaffold project with Vite", priority: "Medium" },
  ],
};
