const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data from TMDB");
  }
  return response.json();
}

export function fetchPopularMovies(page = 1) {
  return tmdbFetch("/movie/popular", { page });
}

export function searchMovies(query, page = 1) {
  return tmdbFetch("/search/movie", { query, page, include_adult: false });
}

export function discoverMovies({ page = 1, genre, year, minRating } = {}) {
  return tmdbFetch("/discover/movie", {
    page,
    sort_by: "popularity.desc",
    with_genres: genre || undefined,
    primary_release_year: year || undefined,
    "vote_average.gte": minRating || undefined,
    "vote_count.gte": minRating ? 50 : undefined,
  });
}

export function fetchMovieGenres() {
  return tmdbFetch("/genre/movie/list");
}

export function fetchMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "videos" });
}

export function getTrailerKey(movie) {
  const results = movie?.videos?.results || [];
  const trailer =
    results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    results.find((v) => v.site === "YouTube");
  return trailer?.key || null;
}

export function posterUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function filterMoviesClient(movies, { genre, year, minRating } = {}) {
  return movies.filter((movie) => {
    if (genre && !(movie.genre_ids || []).includes(Number(genre))) {
      return false;
    }
    if (year) {
      const releaseYear = movie.release_date?.slice(0, 4);
      if (releaseYear !== String(year)) return false;
    }
    if (minRating && (movie.vote_average ?? 0) < Number(minRating)) {
      return false;
    }
    return true;
  });
}
