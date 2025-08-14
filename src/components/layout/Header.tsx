import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Film, Menu, Search, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

export default function Header() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle Theme
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleToggleTheme = () => setIsDark((prev) => !prev);

  //
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 120); // dưới 10px coi như đang ở top
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Lấy danh sách thể loại
  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/genre/movie/list?language=en-US", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setGenres(res.data.genres))
      .catch((err) => console.error("Lỗi fetch genres:", err));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            },
          }
        );
        setSearchResults(res.data.results);
      } catch {
        setSearchResults([]);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header
      className={`flex items-center justify-between p-4 ${
        isAtTop ? "w-full bg-gray-900/50 fixed" : "bg-gray-900 shadow-md sticky"
      } ${
        !isDark ? "!bg-gray-900" : ""
      } text-white top-0 z-50 transition-all duration-500 gap-3`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Film size={28} />
        <Link to="/" className="text-xl font-bold">
          MovieApp
        </Link>
      </div>

      {/* Menu */}
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-yellow-400">
          Home
        </Link>

        {/* Dropdown Genres */}
        <div className="relative group">
          <button className="hover:text-yellow-400 cursor-pointer">
            Thể loại ▾
          </button>
          <div className="absolute left-0 top-6 bg-gray-800 shadow-lg rounded-lg hidden group-hover:grid transition p-3 w-[600px] grid-cols-4 gap-4">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="block px-2 py-1 hover:bg-gray-700 rounded"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/upcoming" className="hover:text-yellow-400">
          Phim sắp ra mắt
        </Link>

        <Link to="/now-playing" className="hover:text-yellow-400">
          Đang chiếu
        </Link>

        <Link to="/top-rated" className="hover:text-yellow-400">
          Top Rated
        </Link>

        <Link to="/my-list" className="hover:text-yellow-400">
          Danh sách của tôi
        </Link>
      </nav>

      {/* Search bar */}
      <div className="hidden md:flex items-center bg-gray-800 rounded-full p-3 w-1/3 relative">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          className="bg-transparent outline-none px-2 w-full text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 top-full mt-2 w-full bg-white rounded shadow-lg z-50 max-h-80 overflow-auto"
          >
            {searchResults.map((movie) => (
              <Link
                key={movie.id}
                to={`/watch/${movie.id}`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => {
                  setSearchResults([]);
                  setQuery("");
                }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "/no-image.jpg"
                  }
                  alt={movie.title}
                  className="w-20 aspect-[1/1] object-cover rounded"
                />
                <div className="font-medium text-gray-800 flex flex-col">
                  <div className="line-clamp-2">{movie.title}</div>
                  <div>⭐ {movie.vote_average.toFixed(1)}</div>
                  {movie.release_date && (
                    <p>
                      📅 {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Toggle theme */}
      <button className="px-1" onClick={handleToggleTheme}>
        {isDark ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-black" />
        )}
      </button>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Menu size={28} />
      </div>
    </header>
  );
}
