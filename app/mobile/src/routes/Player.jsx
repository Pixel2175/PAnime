import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";


const Player = () => {
  const { state } = useLocation();
  const url = `https://pixelll.is-a.dev${state?.url}`;
  const cover = state?.cover;

  useEffect(() => {
    ScreenOrientation.lock({ orientation: 'landscape-primary' });
    return () => {
      ScreenOrientation.unlock();
    };
  }, []);

  return (
    <>
      <video poster={cover} className="w-screen h-screen bg-black" controls autoPlay >
        <source src={url} type="video/mp4" />
      </video>
    </>
  )
}

export default Player;
