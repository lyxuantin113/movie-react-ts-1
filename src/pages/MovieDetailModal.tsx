import { useEffect, useState, useRef } from "react";
import { Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

type Props = {
  movieId: number;
  onClose: () => void;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  name?: string; // cho TV
};

export default function MovieDetailModal({ movieId, onClose }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // ✅ Click ngoài sẽ đóng
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setMovie(res.data))
      .catch((err) => console.error("Lỗi fetch chi tiết phim:", err));
  }, [movieId]);

  if (!movie) return null;

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.jpg";

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto px-60 py-12">
      <div
        ref={modalRef}
        className="relative bg-[#1c1c1c] text-white rounded-lg max-w-[90vw] w-full shadow-lg overflow-hidden"
      >
        {/* ❌ Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X size={24} />
        </button>

        {/* 🎥 Video hoặc ảnh + nút phát */}
        <div className="w-full aspect-video bg-black relative">
          <img
            src={imageUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-3 left-3">
            <Link to={`/watch/${movie.id}`} onClick={onClose}>
              <button className="px-6 py-3 bg-white text-black rounded-md font-semibold text-lg hover:bg-white/80 transition flex items-center gap-2">
                <Play size={24} />
                <span>Phát</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 🧾 Thông tin phim */}
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold mb-2">
            {movie.title || movie.name}
          </h1>
          <div className="text-gray-400 text-sm mb-4">
            ⭐ {movie.vote_average.toFixed(1)} | 📅{" "}
            {new Date(movie.release_date).toLocaleDateString()}
          </div>
          <p className="text-gray-300 mb-6 max-w-3xl">{movie.overview}</p>

          {/* 🧩 Nếu là TV show có nhiều tập */}
          {movie.number_of_seasons && (
            <div className="text-sm text-gray-400 mt-4">
              📺 {movie.number_of_seasons} mùa - {movie.number_of_episodes} tập
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
