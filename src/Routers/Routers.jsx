import { Routes, Route } from "react-router-dom";
import PrayerTimes from "../pages/PrayerTimes";
import Azkar from "../pages/Azkar";
import Quran from "../pages/Quran";
import Surah from "../pages/Surah";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const Routers = () => {
  return (
    <>
      <Header />
      <div className="max-w-[1900px] bg-body mx-auto relative overflow-hidden">
        <div className="container mx-auto">
          <Routes>
            <Route index element={<PrayerTimes />} />
            <Route path="/azkar" element={<Azkar />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/:surahId" element={<Surah />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};
