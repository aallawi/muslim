import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CgMenu, CgClose } from "react-icons/cg";
import { useTranslation } from "react-i18next";
import kaaba from "../assets/logo.png";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState("show");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  // التحكم في عرض شريط التنقل بناءً على التمرير
  const controlNavbar = useCallback(() => {
    if (window.scrollY > lastScrollY && !mobileMenu) {
      setShow("hide");
    } else {
      setShow("show");
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY, mobileMenu]);

  // إضافة وإزالة مستمع التمرير
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-primary" : "hover:text-primary";
  };

  return (
    <header
      className={`fixed w-full h-[60px] z-[99] transition-all duration-1000 select-none bg-white text-secondary shadow-md ${
        show === "hide" && "translate-y-[-60px]"
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-[10px] flex justify-between items-center">
        {/* logo */}
        <div
          className="flex flex-col items-center justify-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img className="max-w-[30px] h-[30px]" src={kaaba} alt="logo" />
          <span className="text-[18px] font-[800]">{t("Muslim")}</span>
        </div>

        {/* Menu */}
        <ul
          className={`${
            mobileMenu
              ? "absolute left-0 top-[60px] w-full h-auto flex flex-col gap-[20px] justify-start p-[20px] transition-all duration-300 bg-white text-[20px] text-black text-center"
              : "hidden md:flex md:items-center"
          } `}
        >
          <li
            className={`mx-[15px] font-[800] cursor-pointer text-[20px] ${isActive(
              "/"
            )}`}
            onClick={() => navigate("/")}
          >
            {t("prayer-times")}
          </li>
          <li
            className={`mx-[15px] font-[800] cursor-pointer text-[20px] ${isActive(
              "/quran"
            )}`}
            onClick={() => navigate("/quran")}
          >
            {t("Quran")}
          </li>
          <li
            className={`mx-[15px] font-[800] cursor-pointer text-[20px] ${isActive(
              "/adhkar"
            )}`}
            onClick={() => navigate("/adhkar")}
          >
            {t("Adhkar")}
          </li>
          <li
            className={`${
              mobileMenu
                ? "hidden"
                : "mx-[10px] font-[500] cursor-pointer text-[20px] transition-all duration-30"
            }`}
          >
            {i18n.language === "en" ? (
              <button
                className="textAra mb-[5px] pb-[5px] font-[700] px-[15px] bg-primary hover:bg-primary-hover hover:text-white rounded-[10px]"
                onClick={() => changeLanguage("ar")}
              >
                عربي
              </button>
            ) : (
              <button
                className="pt-[5px] font-[900] px-[15px] bg-primary hover:bg-primary-hover hover:text-white rounded-[10px]"
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
            )}
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <ul className="flex items-center md:hidden">
          <li className="mx-[10px] font-[500] cursor-pointer text-[20px] hover:text-primary">
            {i18n.language === "en" ? (
              <button
                className="textAra pb-[5px] font-[700] px-[15px] bg-primary hover:bg-primary-hover hover:text-white rounded-[10px]"
                onClick={() => changeLanguage("ar")}
              >
                عربي
              </button>
            ) : (
              <button
                className="pt-[5px] font-[900] px-[15px] bg-primary hover:bg-primary-hover hover:text-white rounded-[10px]"
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
            )}
          </li>
          {mobileMenu ? (
            <li
              className="mx-[10px] font-[500] cursor-pointer text-[24px]"
              onClick={() => setMobileMenu(false)}
            >
              <CgClose />
            </li>
          ) : (
            <li
              className="mx-[10px] font-[500] cursor-pointer text-[24px]"
              onClick={() => setMobileMenu(true)}
            >
              <CgMenu />
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
