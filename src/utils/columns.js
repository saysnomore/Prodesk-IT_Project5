// Single source of truth for column identity, order, and label.
// Keeping this as data (not JSX) means Board/Column stay generic
// and adding a fourth column later is a one-line change here.
export const COLUMNS = [
  { id: "todo", title: "To Do", accentVar: "--todo-accent" },
  { id: "inProgress", title: "In Progress", accentVar: "--progress-accent" },
  { id: "done", title: "Done", accentVar: "--done-accent" },
];

export const PRIORITIES = ["High", "Medium", "Low"];
