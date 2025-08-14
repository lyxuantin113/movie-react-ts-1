import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { CalendarDays, Info, Play, Star } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";

type Film = {
  id: number;
  title: string;
  release_date: string;
  vote_count: number;
  vote_average: number;
  overview: string;
  backdrop_path: string;
};

export default function Banner() {
  const [films, setFilms] = useState<Film[]>([]);
  const { openMovieDetail } = useModal();
  // ✅ Lấy top 3 phim từ API TMDB
  useEffect(() => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`, // dùng token v4
          },
        }
      )
      .then((res) => {
        // chỉ lấy 3 phim đầu
        setFilms(res.data.results.slice(0, 3));
      })
      .catch((err) => console.error("Lỗi fetch top rated movies:", err));
  }, []);

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-auto"
      >
        {films.map((film) => (
          <SwiperSlide key={film.id}>
            <div className="relative w-full aspect-video object-cover max-h-[100vh]">
              {/* Background */}
              <img
                src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`}
                alt={film.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay box */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  {film.title}
                </h2>

                {/* Info line: Date & Vote */}
                <div className="flex items-center gap-6 mt-4 text-gray-200">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} />
                    <span>{film.release_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-400" />
                    <span>
                      {film.vote_average.toFixed(1)} ({film.vote_count} votes)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 max-w-2xl mt-4 text-sm md:text-base">
                  {film.overview}
                </p>

                {/* Button */}
                <div className="flex items-center gap-4">
                  <Link to={`/watch/${film.id}`}>
                    <button className="mt-6 w-fit px-5 py-5 bg-white flex items-center gap-1 cursor-pointer text-black rounded-sm font-semibold hover:bg-white/80 transition-colors">
                      <Play size={24} className="inline-block" />
                      <span className="uppercase font-bold">Phát</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => openMovieDetail(film.id)}
                    className="ml-4 mt-6 w-fit px-5 py-5 bg-gray-700/80 text-white cursor-pointer flex items-center gap-2 rounded-sm font-semibold hover:bg-gray-600 transition-colors"
                  >
                    <Info size={24} className="inline-block" />
                    <span>Thông tin khác</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
