import { useFavorite } from "../context/FavoriteContext";
import MovieCard from "../components/MovieCard";

export default function MyListPage() {
  const { favorites } = useFavorite();

  return (
    <div className="px-8">
      <h1 className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] text-2xl font-bold">
        📚 Danh sách của tôi
      </h1>
      {favorites.length === 0 ? (
        <p className="text-[var(--color-title-light)] dark:text-[var(--color-title-dark)] mt-2">
          Bạn chưa thêm bộ phim yêu thích nào cả.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 py-8">
          {favorites.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
