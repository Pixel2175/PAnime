import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw } from "lucide-react";

const Player = () => {
  const { state } = useLocation();
  const url = `https://pixelll.is-a.dev${state?.url}`;
  const ref = useRef(null);
  const vid = useRef(null);

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fill, setFill] = useState(false);
  const [time, setTime] = useState("00:00 / 00:00");



  const [showBar, setShowBar] = useState(true);


  useEffect(() => {
    const update = () => {
      const v = vid.current;
      setProgress((v.currentTime / v.duration) * 100 || 0);
    };
    const v = vid.current;
    v.addEventListener("timeupdate", update);
    return () => v.removeEventListener("timeupdate", update);
  }, []);

  useEffect(() => {
    ScreenOrientation.lock({ orientation: 'landscape-primary' });
    const reset = () => {
      setShowBar(true);
      clearTimeout(ref.current);
      ref.current = setTimeout(() => setShowBar(false), 2000);
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("touchmove", reset);
    reset();

    return () => {
      ScreenOrientation.unlock();
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("touchmove", reset);
    };
  }, []);

  const seek = (e) => {
    const box = e.target.getBoundingClientRect();
    const percent = (e.clientX - box.left) / box.width;
    vid.current.currentTime = percent * vid.current.duration;
  };


  const runVideo = () => {
    const v = vid.current
    if (v.paused) {
      v.play();
      setPaused(false)

    } else {
      v.pause();
      setPaused(true)
    }
  }

  const addVidTime = (time) => {
    vid.current.currentTime += time
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    const vidd = vid.current;
    if (!vidd) {
      setTime("00:00 / 00:00");
      return;
    }

    const update = () => {
      const cur = isNaN(vidd.currentTime) ? 0 : vidd.currentTime;
      const dur = isNaN(vidd.duration) ? 0 : vidd.duration;
      setTime(`${formatTime(cur)} / ${formatTime(dur)}`);
    };

    vidd.ontimeupdate = update;
    return () => (vidd.ontimeupdate = null);
  }, []);


  return (
    <div className="w-screen h-screen relative">
      <video
        ref={vid}
        className={`${fill ? ("object-fill") : null} w-screen h-screen  absolute top-0 left-0 bg-black`}
        poster="https://pixelll.is-a.dev/static/black.webp"
        autoPlay
        onDoubleClick={() => runVideo()}
        onError={(e) => {
          e.target.load(); // reload the video
          e.target.play().catch(() => { }); // try to auto play again
        }}
      >
        <source src={url} type="video/mp4" />
      </video>
      {showBar &&
        <div className="w-full flex items-center justify-between px-5 text-gray-400 font-bold h-10 bg-black/40 backdrop-blur-md absolute transition-all duration-150  bottom-0 z-10" >
          <div className="flex items-center gap-4">
            <button onClick={() => { addVidTime(-10) }} > <RotateCcw size={19} /> </button>
            <button onClick={() => { runVideo() }} className="">{paused ? (<Play size={23} />) : (<Pause size={26} />)}</button>
            <button onClick={() => { addVidTime(10) }} > <RotateCw size={19} /> </button>
            <span className="ml-3 h-full">{time}</span>
          </div>

          <div onClick={seek} className="absolute rounded-sm bottom-11 left-0 w-full h-2 bg-gray-500 cursor-pointer z-20">
            <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
          </div>


          <button onClick={() => setFill(c => !c)}>{fill ? (<Minimize size={22} />) : (<Maximize size={22} />)}</button>
        </div>}
    </div>
  );
};

export default Player;

