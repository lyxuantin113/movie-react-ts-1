import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Banner from "../components/Banner";
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

export default function MoviePageLayout() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [title, setTitle] = useState("Danh sách phim");

  const location = useLocation();
  const { id } = useParams(); // dùng cho /genre/:id

  // 👉 Refactor toàn bộ đoạn chọn fetchUrl & title vào useEffect
  useEffect(() => {
    const pathname = location.pathname;
    let url = "";
    let pageTitle = "Danh sách phim";

    if (pathname === "/upcoming") {
      url = "https://api.themoviedb.org/3/movie/upcoming?language=en-US";
      pageTitle = "📅 Phim sắp ra mắt";
    } else if (pathname === "/now-playing") {
      url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US";
      pageTitle = "🎬 Đang chiếu";
    } else if (pathname === "/top-rated") {
      url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US";
      pageTitle = "⭐ Top Rated";
    } else if (pathname.startsWith("/genre/") && id) {
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&language=en-US`;
      pageTitle = "🎭 Thể loại phim";
    }

    if (!url) return;

    setTitle(pageTitle); // ✅ Bây giờ gọi hợp lệ
    axios
      .get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error("Lỗi fetch movie list:", err));
  }, [location.pathname, id]); // 📌 nhớ thêm dependency

  // 📥 Sidebar: fetch phim top rated
  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/movie/top_rated?language=en-US", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setTopRated(res.data.results.slice(0, 6)))
      .catch((err) => console.error("Lỗi fetch top rated:", err));
  }, []);

  return (
    <div className="min-h-screen">
      <Banner />
      <div className="mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4 text-[var(--color-title-light)] dark:text-[var(--color-title-dark)]">
          {title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main content: Phim theo loại */}
          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>

          {/* Sidebar: Phim đề xuất */}
          <aside className="md:col-span-3 space-y-4 self-start p-4 bg-[#f8f8ff] shadow-sm rounded-md">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-title-light)]">
              🎯 Đề xuất nổi bật
            </h2>
            {topRated.map((movie) => (
              <Link
                key={movie.id}
                to={`/watch/${movie.id}`}
                className="block hover:bg-gray-100 rounded transition"
              >
                <div className="flex items-center gap-3 p-3 bg-white rounded-md shadow-sm hover:bg-gray-100">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-20 rounded aspect-[4/5] object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-semibold line-clamp-3">{movie.title}</p>
                    <p className="text-xs text-gray-600">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                    {movie.release_date && (
                      <p className="text-xs text-gray-500">
                        📅 {movie.release_date}
                      </p>
                    )}
                    {/* Thông tin chi tiết */}
                    <div className="flex flex-col gap-1 mt-2">
                      <button
                        className="bg-[var(--color-title-light)]/80 text-white text-xs px-3 py-1 rounded hover:bg-[var(--color-title-light)] hover:cursor-pointer transition w-fit"
                        onClick={(e) => {
                          e.preventDefault();
                          // Chuyển hướng đến trang xem phim
                          window.location.href = `/watch/${movie.id}`;
                        }}
                      >
                        Xem phim
                      </button>
                      {/* Có thể thêm thông tin khác nếu muốn */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
