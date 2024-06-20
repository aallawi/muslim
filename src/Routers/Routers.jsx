import { Routes, Route } from "react-router-dom";
import PrayerTimes from "../pages/PrayerTimes";
import Adhkar from "../pages/Adhkar";
import Quran from "../pages/Quran";
import Surah from "../pages/Surah";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Radio from "../pages/Radio";

export const Routers = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1200px] mx-auto relative overflow-hidden">
        <div className="container mx-auto">
          <Routes>
            <Route index element={<PrayerTimes />} />
            <Route path="/adhkar" element={<Adhkar />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/:surahId" element={<Surah />} />
            <Route path="/radio" element={<Radio />} />
          </Routes>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  );
};
