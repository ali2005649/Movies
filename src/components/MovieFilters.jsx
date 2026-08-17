const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i);
const RATINGS = [
  { value: "", label: "Any rating" },
  { value: "5", label: "5+" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

const selectClass =
  "bg-surface text-text-main px-3 py-2 rounded-lg border border-text-muted/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm";

export default function MovieFilters({
  genres,
  genre,
  year,
  minRating,
  onChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={genre}
        onChange={(e) => onChange({ genre: e.target.value })}
        className={selectClass}
        aria-label="Filter by genre"
      >
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onChange({ year: e.target.value })}
        className={selectClass}
        aria-label="Filter by year"
      >
        <option value="">All years</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={minRating}
        onChange={(e) => onChange({ minRating: e.target.value })}
        className={selectClass}
        aria-label="Filter by rating"
      >
        {RATINGS.map((r) => (
          <option key={r.value || "any"} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {(genre || year || minRating) && (
        <button
          type="button"
          onClick={() => onChange({ genre: "", year: "", minRating: "" })}
          className="text-sm text-primary hover:underline font-semibold"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
