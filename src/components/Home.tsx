import Banner from "./Banner";
import FilmSection from "./FilmSection";
export default function Home() {
  const filmSections = [
    {
      title: "🔥 Phim nổi tiếng",
      fetchUrl: "https://api.themoviedb.org/3/movie/popular?language=en-US",
    },
    {
      title: "⭐ Top Rated",
      fetchUrl: "https://api.themoviedb.org/3/movie/top_rated?language=en-US",
    },
    {
      title: "📅 Sắp ra mắt",
      fetchUrl: "https://api.themoviedb.org/3/movie/upcoming?language=en-US",
    },
    {
      title: "🎞 Đang chiếu",
      fetchUrl: "https://api.themoviedb.org/3/movie/now_playing?language=en-US",
    },
    {
      title: "📺 Phim bộ nổi bật",
      fetchUrl: "https://api.themoviedb.org/3/tv/popular?language=en-US",
    },
    {
      title: "💖 Phim được yêu thích",
      fetchUrl: "https://api.themoviedb.org/3/movie/now_playing?language=en-US", // ví dụ lặp lại
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Banner />
      <main className="px-4 pt-8 pb-16">
        {filmSections.map((section) => (
          <FilmSection
            key={section.title}
            title={section.title}
            fetchUrl={section.fetchUrl}
          />
        ))}
      </main>
    </div>
  );
}
