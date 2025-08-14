import { useState } from "react";
import { Play, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import { useFavorite } from "../context/FavoriteContext";

type MovieCardProps = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

export default function MovieCard({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
}: MovieCardProps) {
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/no-image.jpg";

  const { openMovieDetail } = useModal();

  const { favorites, addFavorite, removeFavorite } = useFavorite();
  const isFavorite = favorites.some((m) => m.id === id);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group overflow-visible w-full hover:z-30 hover:scale-125 transition-transform hover:cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <Link to={`/watch/${id}`} className="block">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-md aspect-[2/3] object-cover w-full group-hover:shadow-2xl"
        />
      </Link>
      <div className="absolute top-2 left-2 bg-white/70 text-black text-xs px-2 py-0.5 rounded">
        ⭐ {vote_average.toFixed(1)}
      </div>
      {/* Overlay card – hiện khi hover */}
      <div className="absolute bottom-0 right-0 w-full h-auto bg-black/80 rounded-bl-md rounded-br-md hidden group-hover:flex transition-opacity duration-300 flex-col p-4 justify-end">
        {/* Tên phim */}
        <h3 className="text-white text-sm font-bold line-clamp-2">{title}</h3>

        {/* Các nút action */}
        <div className="flex gap-2 mt-2">
          <Link to={`/watch/${id}`}>
            <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 cursor-pointer">
              <Play size={16} />
            </button>
          </Link>
          {!isFavorite ? (
            <button
              className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 cursor-pointer flex items-center gap-1"
              onClick={() =>
                addFavorite({
                  id,
                  title,
                  poster_path,
                  vote_average,
                  release_date,
                })
              }
            >
              <Plus size={16} />
            </button>
          ) : (
            <button
              className="bg-gray-700 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer flex items-center gap-1"
              onClick={() => hovered && removeFavorite(id)}
            >
              <Plus size={16} />
              <span className="text-xs ml-1">
                {hovered ? "Xóa" : "Đã thêm"}
              </span>
            </button>
          )}
          <button
            onClick={() => openMovieDetail(id)}
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 cursor-pointer"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Info nhanh */}
        <div className="text-gray-300 text-xs mt-2">
          <p>⭐ {vote_average.toFixed(1)} điểm</p>
          {release_date && (
            <p>📅 {new Date(release_date).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
