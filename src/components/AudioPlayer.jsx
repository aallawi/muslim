import { useRef, useEffect, useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const AudioPlayer = ({
  sound,
  isPlaying,
  onPlay,
  onEnd,
  repeatCount,
  increaseCounter,
}) => {
  const audioRef = useRef();
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.5;

    const handleEnded = () => {
      increaseCounter(); // استدعاء increaseCounter بعد كل تشغيل
      if (playCount < repeatCount - 1) {
        setPlayCount((prevCount) => prevCount + 1);
        audio.play();
      } else {
        setPlayCount(0);
        onPlay(null);
        onEnd(); // استدعاء onEnd بعد الانتهاء من جميع التكرارات
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playCount, repeatCount, onPlay, onEnd, increaseCounter]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div>
      <audio ref={audioRef} src={sound}></audio>
      <button onClick={onPlay}>
        {isPlaying ? <FaPauseCircle size={30} /> : <FaPlayCircle size={30} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
