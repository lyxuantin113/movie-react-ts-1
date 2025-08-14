import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import MyListPage from "./pages/MyListPage";
import Footer from "./components/layout/Footer";
import MoviePageLayout from "./pages/MoviePageLayout";
import WatchPage from "./pages/WatchPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 py-[80px] bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
        {/* ✅ Dùng React Router để điều hướng */}
        <Routes>
          {/* Trang chính hiển thị Banner */}
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />

          {/* Các trang phim */}
          <Route path="/upcoming" element={<MoviePageLayout />} />
          <Route path="/now-playing" element={<MoviePageLayout />} />
          <Route path="/top-rated" element={<MoviePageLayout />} />
          <Route path="/genre/:id" element={<MoviePageLayout />} />

          {/* Trang Danh sách của tôi */}
          <Route path="/my-list" element={<MyListPage />} />

          {/* Trang xem phim */}
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
