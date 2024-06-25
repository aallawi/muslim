import { useRef, useEffect, useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const AudioPlayer = ({
  sound,
  isPlaying,
  onPlay,
  onEnd,
  repeatCount,
  increaseCounter,
  playbackRate,
}) => {
  const audioRef = useRef();
  const [playCount, setPlayCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.5;
    audio.playbackRate = playbackRate;

    const handleEnded = () => {
      increaseCounter();
      if (playCount < repeatCount - 1) {
        setPlayCount((prevCount) => prevCount + 1);
        audio.play();
      } else {
        setPlayCount(0);
        setCurrentTime(0);
        onPlay(null);
        onEnd();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playCount, repeatCount, onPlay, onEnd, increaseCounter, playbackRate]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [isPlaying, currentTime]);

  return (
    <div>
      <audio ref={audioRef} src={sound}></audio>
      <button onClick={onPlay} className="border-none outline-none ">
        {isPlaying ? (
          <FaPauseCircle color="#2c786c" size={45} />
        ) : (
          <FaPlayCircle color="blue" size={45} />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
