import { useRef, useEffect, useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const AudioPlayer = ({ sound, isPlaying, onPlay, repeatCount }) => {
  const audioRef = useRef();
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.5;

    const handleEnded = () => {
      if (playCount < repeatCount - 1) {
        setPlayCount((prevCount) => prevCount + 1);
        audio.play();
      } else {
        setPlayCount(0);
        onPlay(null);
      }
    };

    audio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying, playCount, repeatCount, onPlay]);

  return (
    <div className="app-container">
      <audio ref={audioRef} src={sound}></audio>
      {isPlaying ? (
        <FaPauseCircle size={30} onClick={onPlay} />
      ) : (
        <FaPlayCircle size={30} onClick={onPlay} />
      )}
    </div>
  );
};

export default AudioPlayer;
