import { useState, useEffect } from "react";
import { RiMenu3Fill, RiCloseLargeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import kaaba from "../assets/logo.png";

export default function Header() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18next.language;

  const navigate = useNavigate();
  const [header, setHeader] = useState(false);
  const [nav, setNav] = useState(false);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    window.location.reload();
  };

  return (
    <header className="fixed w-full max-w-[1920px] mx-auto z-20 transition-all duration-300 py-2 bg-white">
      <div className="flex flex-col items-center mx-auto xl:container xl:flex-row xl:justify-between">
        {/* logo */}
        <div className="flex items-center justify-between w-full px-4 xl:w-auto">
          <a
            href="/"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <img className="w-[30px] h-[30px]" src={kaaba} alt="Muslim" />
            <span className="font-logo text-[18px] font-[800]">
              {t("Muslim")}
            </span>
          </a>

          <div className="flex items-center justify-center gap-5 cursor-pointer xl:hidden">
            {i18n.language == "en" ? (
              <button className="lang" onClick={() => changeLanguage("ar")}>
                عربي
              </button>
            ) : (
              <button className="lang" onClick={() => changeLanguage("en")}>
                EN
              </button>
            )}
            {nav ? (
              <RiCloseLargeLine onClick={() => setNav(!nav)} />
            ) : (
              <RiMenu3Fill onClick={() => setNav(!nav)} />
            )}
          </div>
        </div>

        {/* nav */}
        <nav
          className={`${
            nav ? "max-h-max py-2 px-4 xl:py-0 xl:px-0" : "max-h-0 xl:max-h-max"
          } flex flex-col items-center w-full bg-white gap-y-6 overflow-hidden font-[700] text-center uppercase text-sm transition-all duration-150
           xl:flex-row xl:font-medium xl:w-max xl:gap-x-8 xl:h-max xl:bg-transparent xl:pb-0 xl:text-left xl:text-[15px] xl:normal-case`}
        >
          <p className="cursor-pointer" onClick={() => navigate("/")}>
            {t("prayer-times")}
          </p>
          <p className="cursor-pointer" onClick={() => navigate("/quran")}>
            {t("Quran")}
          </p>
          <p className="cursor-pointer" onClick={() => navigate("/azkar")}>
            {t("Azkar")}
          </p>
        </nav>
      </div>
    </header>
  );
}
