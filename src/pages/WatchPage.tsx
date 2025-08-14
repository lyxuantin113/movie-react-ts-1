import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import VimeoEmbed from "../components/VimeoEmbed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
};

export default function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [related, setRelated] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);

  // 📥 Lấy thông tin chi tiết phim
  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setMovie(res.data))
      .catch((err) => console.error("Lỗi lấy chi tiết phim:", err));
  }, [id]);

  // 📥 Lấy danh sách phim cùng thể loại
  useEffect(() => {
    if (!movie || movie.genres.length === 0) return;
    const genreId = movie.genres[0].id;
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        }
      )
      .then((res) => setRelated(res.data.results))
      .catch((err) => console.error("Lỗi fetch phim cùng thể loại:", err));
  }, [movie]);

  // 📥 Lấy top rated
  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/movie/top_rated?language=en-US", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setTopRated(res.data.results.slice(0, 12)))
      .catch((err) => console.error("Lỗi fetch top rated:", err));
  }, []);

  if (!movie)
    return (
      <div className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] p-8">
        Đang tải...
      </div>
    );

  return (
    <div className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] min-h-screen overflow-x-hidden pt-4">
      {/* 🎥 Section 1: Video player */}
      <div className="w-full max-w-[80vw] h-full max-h-[80vh] px-4 mx-auto aspect-video bg-black rounded-lg overflow-hidden">
        <VimeoEmbed key={movie.id} />
      </div>

      {/* 🧾 Section 2: Thông tin phim */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] text-3xl font-bold mb-2">
          {movie.title}
        </h1>
        <div className="dark:text-gray-400 text-[var(--color-title-light)] text-sm mb-4">
          ⭐ {movie.vote_average.toFixed(1)} | 📅{" "}
          {new Date(movie.release_date).toLocaleDateString()}
        </div>
        <p className="dark:text-gray-300 text-[var(--color-title-light)] mb-6 max-w-3xl">
          {movie.overview}
        </p>
      </div>

      {/* 🌀 Section 3: Các phim liên quan */}
      <div className="overflow-x-hidden container mx-auto px-4 py-12 space-y-10">
        {/* 🎭 Cùng thể loại */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-[var(--color-title-light)] dark:text-[var(--color-title-dark)]">
            🎭 Phim cùng thể loại
          </h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={12}
            slidesPerView={5}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full !overflow-visible"
          >
            {related.map((m) => (
              <SwiperSlide key={m.id}>
                <MovieCard {...m} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ⭐ Top Rated */}
        <div>
          <h2 className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] text-2xl font-semibold mb-3 ">
            ⭐ Phim nổi bật
          </h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={12}
            slidesPerView={5}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full !overflow-visible"
          >
            {topRated.map((m) => (
              <SwiperSlide key={m.id}>
                <MovieCard {...m} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
