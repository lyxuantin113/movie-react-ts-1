import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieDetailModal from "../pages/MovieDetailModal";

type ModalContextType = {
  openMovieDetail: (id: number) => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  return useContext(ModalContext)!;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openMovieDetail = (id: number) => {
    const params = new URLSearchParams(location.search);
    params.set("modal", String(id));
    navigate({ search: params.toString() });
  };

  const closeModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete("modal");
    navigate({ search: params.toString() }, { replace: true });
  };

  // 👇 Lắng nghe URL để mở / đóng modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modalId = params.get("modal");

    if (modalId) {
      setSelectedMovieId(parseInt(modalId));
    } else {
      setSelectedMovieId(null);
    }
  }, [location.search]);

  return (
    <ModalContext.Provider value={{ openMovieDetail }}>
      {children}

      {selectedMovieId && (
        <MovieDetailModal movieId={selectedMovieId} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
}
