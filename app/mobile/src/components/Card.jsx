import { useState } from "react";
import { Link } from "react-router-dom";

const Card = ({ data, grid }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Link to="/details" state={{ data }} >
      {
        grid ? (
          <div className="flex flex-col rounded-lg overflow-hidden shadow-xl border border-light" >
            <div className="h-[80%]">
              <img
                loading="lazy"
                src={data.poster}
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
            <div className="h-[20%] px-2 py-1">
              <h1 className="truncate text-sm text-white">{data.title_en}</h1>
            </div>
          </div >
        ) : (
          <div className="flex items-center gap-4 rounded-lg p-1">
            <img src={data.poster} loading="lazy" alt={data.title_en} className="w-[20%] object-cover rounded-md" />
            <div className="flex flex-col">
              <h2 className="text-white font-semibold">{data.title_en}</h2>
              <span className="text-sm">Episodes: {data.episodes}</span>
              <span className="text-sm">Rating: {data.rating}</span>
              <span className="text-sm">Status: {data.status}</span>
            </div>
          </div>
        )}
    </Link >
  );
};

export default Card;

