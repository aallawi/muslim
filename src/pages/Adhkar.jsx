import { useEffect, useRef, useState } from "react";
import allAdhkar from "../assets/data/allAdhkar";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import DuaaAdhar from "../assets/images/duaa-adhkar.png";
import Done from "../assets/images/done.svg";
import Choose from "../assets/images/choose.svg";
import AudioPlayer from "../components/AudioPlayer";

const Adhkar = () => {
  const sectionRef = useRef(null);
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const [idSelected, setIdSelected] = useState();
  const [ehikr, setEhikr] = useState();
  const [counters, setCounters] = useState({});
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const audioRefs = useRef([]);

  useEffect(() => {
    setEhikr(allAdhkar.find((category) => category.id === idSelected));
  }, [idSelected]);

  const [playing, setPlaying] = useState(null);
  const handlePlay = (src, index) => {
    setPlaying((prevPlaying) => (prevPlaying === src ? null : src));
    setCurrentAudioIndex(index);
  };

  const handlePlaybackRateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setPlaybackRate(newRate);
  };

  useEffect(() => {
    const initialCounters = {};
    if (ehikr) {
      ehikr.array.forEach((item) => {
        initialCounters[item.id] = item.read || 0;
      });
      setCounters(initialCounters);
    }
  }, [ehikr]);

  useEffect(() => {
    if (ehikr) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ehikr]);

  useEffect(() => {
    if (currentAudioIndex !== null && audioRefs.current[currentAudioIndex]) {
      audioRefs.current[currentAudioIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentAudioIndex]);

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

  const ChooseEhikr = (id) => {
    setIdSelected(id);
  };

  const handleEnd = () => {
    console.log("تم تشغيل الصوت عدد المرات المطلوبه");
    if (currentAudioIndex !== null) {
      const nextIndex = currentAudioIndex + 1;
      if (nextIndex < ehikr.array.length) {
        setCurrentAudioIndex(nextIndex);
        setPlaying(ehikr.array[nextIndex].audio);
      } else {
        setCurrentAudioIndex(null);
        setPlaying(null);
        setIsAutoPlaying(false);
      }
    }
  };

  const handleAutoStart = () => {
    if (ehikr.array.length > 0) {
      setCurrentAudioIndex(0);
      setPlaying(ehikr.array[0].audio);
      setIsAutoPlaying(true);
    }
  };

  const handleAutoPause = () => {
    setPlaying(null);
    setIsAutoPlaying(false);
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
              onClick={() => ChooseEhikr(item.id)}
              className={`${
                item.id === idSelected
                  ? "bg-primary text-black font-[700]"
                  : "bg-secondary text-white"
              } hover:bg-primary min-h-[60px] rounded-md p-[10px] text-center select-none`}
            >
              {currentLanguage === "en" ? item.categoryEng : item.category}
            </button>
          );
        })}
      </div>

      {/* The chosen dhkar */}
      {ehikr ? (
        <div
          ref={sectionRef}
          className="my-[40px] border-secondary border-solid border-[2px] rounded-[10px] overflow-hidden relative"
        >
          <div className="flex justify-center items-center text-center bg-primary border-secondary border-solid border-b-[2px]">
            <h1 className="p-[10px] flex-1 order-1 text-[20px] md:text-[30px] font-[600]">
              {currentLanguage === "en" ? ehikr.categoryEng : ehikr.category}
            </h1>
            {ehikr.array[0].audio && (
              <div
                className={`${
                  currentLanguage === "en" ? "border-r-[2px]" : "border-l-[2px]"
                } p-[10px] border-black `}
              >
                <button
                  onClick={isAutoPlaying ? handleAutoPause : handleAutoStart}
                  className="outline-none border-none bg-[#efefef] px-[30px] py-[5px] text-[16px] rounded-[4px] font-[600] mb-[10px] hover:bg-[#0075ff] hover:text-white"
                >
                  {t("Auto-play")}
                </button>
                <div className=" text-[10px] flex flex-col">
                  <div className="flex items-center justify-center gap-[5px]">
                    <span>0.5X</span>
                    <input
                      className="max-w-[80px] md:max-w-[120px]"
                      type="range"
                      id="playbackRate"
                      value={playbackRate}
                      onChange={handlePlaybackRateChange}
                      min="0.5"
                      max="2.5"
                      step="0.1"
                    />
                    <span>2.5X</span>
                  </div>
                  <span className="bg-[#efefef] w-[35px] h-[35px] m-auto rounded-full flex justify-center items-center">
                    {playbackRate}x
                  </span>
                </div>
              </div>
            )}
          </div>
          <div>
            {ehikr.array.map((item, index) => (
              <div
                key={index}
                ref={(el) => (audioRefs.current[index] = el)}
                className={`p-[10px] text-[25px] flex items-stretch gap-[20px] leading-[55px] border-secondary border-solid border-b-[2px] ${
                  isCompleted(item.id) ? "bg-green-500" : ""
                }`}
              >
                {/* counter */}
                <div
                  className={`${
                    currentLanguage == "en"
                      ? "border-r pr-[10px]"
                      : "border-l pl-[10px]"
                  } flex flex-col gap-[20px] justify-center items-center cursor-pointer w-[90px] select-none border-solid border-[#c1c1c1]`}
                >
                  <div onClick={() => increaseCounter(item.id)}>
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

                  <div className="sound">
                    {item.audio && (
                      <AudioPlayer
                        sound={item.audio}
                        isPlaying={playing === item.audio}
                        onPlay={() => handlePlay(item.audio, index)}
                        increaseCounter={() => increaseCounter(item.id)}
                        repeatCount={item.count}
                        onEnd={handleEnd}
                        playbackRate={playbackRate}
                      />
                    )}
                  </div>
                </div>

                {/* text */}
                <div className="flex flex-col items-center justify-center flex-1 text-secondary text-[18px] md:text-[20px]">
                  <p className="textAra rtl  pr-[10px] text-right leading-[45px] md:leading-[55px]">
                    {item.text}
                  </p>
                  <p className="leading-[30px] md:leading-[40px] mt-[20px]">
                    {currentLanguage === "en" && item.textEng}
                  </p>
                </div>
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
