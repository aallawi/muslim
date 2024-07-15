import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { TbRewindBackward30, TbRewindForward30 } from "react-icons/tb";
import i18next from "i18next";
import Options from "./Options";

const AudioPlayerBottom = ({ audioScource, blockClass, setAudioClass }) => {
  const currentLanguage = i18next.language;
  const audioRef = useRef();
  const buttonRef = useRef(null);

  const [play, setPlay] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [dotePosition, setDotePosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewOptions, setViewOptions] = useState(false);
  const [speedClass, setSpeedClass] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours > 0 ? `${hours}:` : ""}${
      minutes < 10 && hours > 0 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const controlAudio = () => {
    if (audioRef.current) {
      setInterval(() => {
        setCurrentTime(audioRef.current.currentTime);
        setProgressWidth(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
        setDotePosition(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      }, 1000);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
        setLoading(false);
      };
    }
  }, []);

  const togglePlayAudioIcon = () => {
    if (play) {
      setPlay(false);
      audioRef.current.pause();
    } else {
      setPlay(true);
      audioRef.current.play();
    }
  };

  const removeAudio = () => {
    audioRef.current.pause();
    setAudioClass(false);
    setViewOptions(false);
    setSpeedClass(false);
  };

  const skipForward = () => {
    audioRef.current.currentTime += 30;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 30;
  };

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setViewOptions(false);
      setSpeedClass(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-primary duration-700 transition-all ease-in-out ${
        blockClass ? "bottom-0" : "bottom-[-70px]"
      }`}
    >
      <div className="relative flex justify-between">
        <span
          className="absolute z-[3] t-0 w-[15px] h-[15px] transform -translate-y-1/2 bg-blue-500 rounded-full cursor-pointer"
          style={{
            ...(currentLanguage === "en"
              ? { left: `${dotePosition}%` }
              : { right: `${dotePosition}%` }),
          }}
        />
        <span
          className="absolute h-[4px] bg-blue-500 cursor-pointer"
          style={{
            width: `${progressWidth}%`,
            right: 0,
            top: "-2px",
            ...(currentLanguage === "en" ? { left: 0 } : { right: 0 }),
          }}
        />
      </div>

      <div className="z-[20] flex items-center justify-between w-full h-12 px-2">
        <div className="flex items-center justify-between w-full ">
          <div className="mb-[20px] text-[18px] font-[600]">
            {formatTime(currentTime)}
          </div>

          <div className="flex ">
            <div className="relative">
              <button
                onClick={() => setViewOptions(!viewOptions)}
                className="z-30 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
              >
                <HiDotsHorizontal size={20} />
              </button>
              <div ref={buttonRef}>
                <Options
                  ref={buttonRef}
                  viewOptions={viewOptions}
                  setViewOptions={setViewOptions}
                  speedClass={speedClass}
                  setSpeedClass={setSpeedClass}
                  audioScource={audioScource}
                  audioRef={audioRef}
                />
              </div>
            </div>

            <button
              onClick={skipBackward}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            >
              {currentLanguage == "en" ? (
                <TbRewindBackward30 size={20} />
              ) : (
                <TbRewindForward30 size={20} />
              )}
            </button>

            <button
              onClick={() => togglePlayAudioIcon()}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            >
              {loading === false ? (
                play ? (
                  <FaPause size={20} />
                ) : (
                  <FaPlay size={20} />
                )
              ) : (
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
              )}
            </button>

            <button
              onClick={skipForward}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            >
              {currentLanguage == "en" ? (
                <TbRewindForward30 size={20} />
              ) : (
                <TbRewindBackward30 size={20} />
              )}
            </button>

            <button
              onClick={() => removeAudio()}
              className="z-30 flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-500 hover:text-white"
            >
              <IoClose size={23} />
            </button>
          </div>

          <div className="mb-[20px] text-[18px] font-[600]">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      <audio
        src={`${audioScource}`}
        autoPlay
        ref={audioRef}
        onPlay={() => controlAudio()}
      ></audio>
    </div>
  );
};

export default AudioPlayerBottom;
