import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";
import { SiSpeedtest } from "react-icons/si";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const allSpeed = [
  { id: 0, speed: 0.5 },
  { id: 1, speed: 0.75 },
  { id: 2, speed: 1 },
  { id: 3, speed: 1.25 },
  { id: 4, speed: 1.5 },
  { id: 5, speed: 1.75 },
  { id: 6, speed: 2 },
  { id: 7, speed: 2.5 },
];

const Options = ({
  viewOptions,
  setViewOptions,
  speedClass,
  setSpeedClass,
  audioScource,
  audioRef,
}) => {
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const [currentSpeed, setCurrentSpeed] = useState(1);

  const downloadAudio = async (audioScource) => {
    try {
      const response = await fetch(audioScource);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      const filename = audioScource.substring(
        audioScource.lastIndexOf("/") + 1
      );
      console.log(filename);
      link.download = filename;

      link.click();
      setViewOptions(false);
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  const handleSpeedChange = (speed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setCurrentSpeed(speed);
      setSpeedClass(false);
      setViewOptions(false);
    }
  };

  return (
    <div className="options">
      <div
        className={`${
          viewOptions ? "block" : "hidden"
        } absolute bottom-11 bg-white overflow-hidden w-[150px] rounded-md shadow-md left-[-60px] md:left-0 `}
      >
        <div
          className="flex items-center p-2 gap-[12px] cursor-pointer hover:bg-gray-300"
          onClick={() => downloadAudio(audioScource)}
        >
          <FaDownload size={16} />
          <p>{t("Download")}</p>
        </div>

        <div
          className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-300"
          onClick={() => setSpeedClass(true)}
        >
          <div className="flex items-center justify-between gap-[10px] ">
            <SiSpeedtest size={16} />
            <p>{t("Speed")}</p>
          </div>
          {currentLanguage == "en" ? (
            <MdArrowForwardIos size={16} />
          ) : (
            <MdArrowBackIos size={16} />
          )}
        </div>
      </div>

      <div
        className={`${
          speedClass ? "block" : "hidden"
        }  absolute bottom-11 bg-white overflow-hidden w-[150px] rounded-md shadow-md left-[-60px] md:left-0`}
      >
        <div
          className="flex items-center p-2 cursor-pointer hover:bg-gray-300 gap-[10px]"
          onClick={() => setSpeedClass(false)}
        >
          {currentLanguage == "en" ? (
            <FaChevronLeft size={16} />
          ) : (
            <FaChevronRight size={16} />
          )}
          <p>{t("Speed")}</p>
        </div>
        <div className="flex flex-col justify-start">
          {allSpeed.map((item, index) => (
            <button
              key={index}
              className={`${
                item.speed == currentSpeed ? "bg-gray-300" : "bg-gray-50"
              } p-1 cursor-pointer hover:bg-gray-300`}
              onClick={() => handleSpeedChange(item.speed)}
            >
              {item.speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Options;
