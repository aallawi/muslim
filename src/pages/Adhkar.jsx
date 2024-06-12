import { useEffect, useState } from "react";
import allAdhkar from "../allAdhkar";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import DuaaAdhar from "../assets/duaa-adhkar.png";
import Done from "../assets/done.svg";
import Choose from "../assets/choose.svg";

const Adhkar = () => {
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const [idSelected, setIdSelected] = useState();
  const [ehikr, setEhikr] = useState();
  const [counters, setCounters] = useState({});

  useEffect(() => {
    setEhikr(allAdhkar.find((category) => category.id === idSelected));
  }, [idSelected]);

  useEffect(() => {
    const initialCounters = {};
    if (ehikr) {
      ehikr.array.forEach((item) => {
        initialCounters[item.id] = item.read || 0;
      });
      setCounters(initialCounters);
    }
  }, [ehikr]);

  const increaseCounter = (id) => {
    setCounters((prevCounters) => {
      const newCount = prevCounters[id] + 1;
      if (ehikr.array.find((item) => item.id === id).count >= newCount) {
        return {
          ...prevCounters,
          [id]: newCount,
        };
      }
      return prevCounters;
    });
  };

  const isCompleted = (id) =>
    counters[id] >= ehikr.array.find((item) => item.id === id).count;

  return (
    <div className="pt-[100px] mx-[10px] md:mx-0">
      {/* banner */}
      <div className="flex items-center justify-center mb-[40px]">
        {currentLanguage == "en" ? (
          <img
            className="max-w-[300px]"
            src={DuaaAdhar}
            alt="Duaa And Adhkar"
          />
        ) : (
          <p className="text-[40px] font-[800]">
            أدعـيـــــــــة وأذكـــــــــار
          </p>
        )}
      </div>

      {/* all Adhkar*/}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {allAdhkar.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => setIdSelected(item.id)}
              className={`${
                item.id === idSelected
                  ? "bg-primary text-black font-[700]"
                  : "bg-secondary text-white"
              } hover:bg-primary min-h-[60px] rounded-md py-[10px] px-[10px] text-center select-none`}
            >
              {currentLanguage === "en" ? item.categoryEng : item.category}
            </button>
          );
        })}
      </div>

      {/* The chosen dhkar */}
      {ehikr ? (
        <div className="my-[40px] border-secondary border-solid border-[2px] rounded-[10px] overflow-hidden">
          <h2 className="text-center font-[600] py-[10px] text-[30px] bg-primary border-secondary border-solid border-b-[2px]">
            {currentLanguage === "en" ? ehikr.categoryEng : ehikr.category}
          </h2>
          <div>
            {ehikr.array.map((item, index) => (
              <div
                key={index}
                className={`p-[10px] text-[25px] flex items-stretch gap-[20px] leading-[55px] border-secondary border-solid border-b-[2px] ${
                  isCompleted(item.id) ? "bg-green-500" : ""
                }`}
              >
                {/* counter */}
                <div
                  onClick={() => increaseCounter(item.id)}
                  className={`${
                    currentLanguage == "en"
                      ? "border-r pr-[10px]"
                      : "border-l pl-[10px]"
                  } flex flex-col justify-center items-center cursor-pointer w-[90px] select-none border-solid border-[#c1c1c1]`}
                >
                  <p className="w-[60px] h-[60px] text-[25px] text-center font-[600] bg-primary text-secondary rounded-full">
                    {item.count}
                  </p>
                  {isCompleted(item.id) ? (
                    <div className="w-[50px] mt-[10px]">
                      <img src={Done} sizes="20" />
                    </div>
                  ) : (
                    <p className="text-[20px] font-[500]">
                      {counters[item.id] || 0} {t("Times")}
                    </p>
                  )}
                </div>

                {/* text */}
                <p className="flex flex-col items-center flex-1 text-secondary">
                  <p className="textAra rtl pr-[10px] text-right">
                    {item.text}
                  </p>
                  <p>{currentLanguage === "en" && item.textEng}</p>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-[25px] my-[30px]">{t("the-dhikr-display")}</p>
          <img
            src={Choose}
            className="w-[400px]"
            alt={t("the-dhikr-display")}
          />
        </div>
      )}
    </div>
  );
};

export default Adhkar;
