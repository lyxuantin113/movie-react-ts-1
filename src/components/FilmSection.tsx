import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

type FilmSectionProps = {
  title: string;
  fetchUrl: string;
};

export default function FilmSection({ title, fetchUrl }: FilmSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get(fetchUrl, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error("Lỗi fetch movies:", err));
  }, [fetchUrl]);

  return (
    <section className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-3 text-[var(--color-title-light)] dark:text-[var(--color-title-dark)]">
        {title}
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
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average}
              release_date={movie.release_date}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
