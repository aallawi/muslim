import { useState, useEffect } from "react";
import arrowTop from "../assets/images/arrow.svg";
import i18next from "i18next";

const ScrollToTop = () => {
  const currentLanguage = i18next.language;
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 600);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-[30px] h-[50px] w-[50px] rounded-full border-none cursor-pointer animate-bounce ${
            currentLanguage === "en" ? "left-[30px]" : "right-[30px]"
          }`}
        >
          <img src={arrowTop} alt="Scroll to top" className="w-full h-full" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
