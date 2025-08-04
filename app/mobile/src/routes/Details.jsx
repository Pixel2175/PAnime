import { ArrowLeft, Star, Tv } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Details = () => {
  const { state } = useLocation();
  const data = state?.data
  return (
    <div className="details-page bg-dark w-screen h-screen shrink1 text-t-light overflow-y-scroll ">
      <div
        className="anime-page-img w-full pt-4 rounded-t-xl"
        style={{ backgroundImage: `url(${data?.cover})` }}>
        <div className="h-14 flex items-center  px-3  w-full ">
          <Link to={-1}>
            <ArrowLeft size={26} className="font-bold" />
          </Link>
        </div>

        <div className=" overflow-hidden w-full  h-full flex items-center pl-6">
          <div className="h-full pb-20">
            <img className="object-cover h-full rounded-lg" src={data?.poster} />
          </div>

          <div className="pl-3 mb-16 flex flex-col gap-5 text-[0.90rem]" >
            <h2 className="font-bold ">{data?.title_en}</h2>

            <div className="text-[1.70rem]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1   text-xs text-gray-400">
                  <Tv width={15} className="text-xs" />
                  <h2 className="pt-1">{data?.episodes}</h2>
                </div>
                <span className=" text-sm text-gray-400">|</span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Star width={15} className="text-xs" />
                  <h2 className="pt-1">{(data?.rating / 10).toFixed(2)}</h2>
                </div>
              </div>

              <div className="text-gray-400 text-xs flex gap-2">
                <h2>{data?.type}</h2>
                <span className="pl-1 text-sm text-gray-400">|</span>
                <h2>{data?.status}</h2>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div className=" flex flex-col  text-sm overflow-auto items-center px-5 w-full">
        <div className="flex z-10 items-start px-2 w-full flex-col pb-6 mb-4 text-t-light flex-1">
          <Link to="/episodes" state={{ episodes: data.slug }}>
            <div className="px-4  text-center py-3  bg-mid rounded-lg text-[17px]">Episodes</div>
          </Link>
        </div>

        <div className="flex items-center flex-col text-gray-399 flex-1">
          <h5 className="text-gray-300 text-xl font-bold pb-2">Story</h5>
          <p className="text-center">
            {data?.story}
          </p>
        </div>

        <div className="border-[#3A253A] text-center border-t-2 mt-8 mb-4 w-2/3  " ></div>

        <div className="w-full px-5 flex gap-2 justify-center flex-wrap" >
          <h2 className="bg-[#2A253A] px-2 py-1 rounded-xl">Action</h2>
          <h2 className="bg-[#2A253A] px-2 py-1 rounded-xl">Drama</h2>
          <h2 className="bg-[#2A253A] px-2 py-1 rounded-xl">Samurai</h2>
        </div>
      </div>
    </div >
  );
};


export default Details;
