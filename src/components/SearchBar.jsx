import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        className="search-bar__input"
        placeholder="Search the log…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
