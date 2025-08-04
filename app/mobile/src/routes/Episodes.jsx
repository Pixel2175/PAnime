import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";


const Episodes = () => {
  const [episodes, setEpisodes] = useState({})
  const [reversed, setReversed] = useState(false);


  const { state } = useLocation();
  const slug = state.episodes;

  useEffect(() => {
    fetch(`https://pixelll.is-a.dev/api/anime/${slug}/episodes`)
      .then(res => res.json())
      .then(data => {
        setEpisodes(data)
      })
      .catch(() => { });

  }, [slug])



  console.log(episodes);
  return (
    <div className="bg-dark pt-10 text-t-light p-4 h-screen w-screen flex flex-col ">
      <Header yes={true} route="back" reversed={reversed} setReversed={setReversed} />
      <h1 className="font-bold text-3xl text-center mb-2 mt-12">Episodes</h1>
      <div className={`flex-1 mt-4 rounded-md px-4  flex flex-col ${reversed ? "flex-col-reverse" : "flex-col"} overflow-y-auto`}>

        {Object.entries(episodes).map(([epNum, qualities], index) => (
          <div key={index} className="w-full flex justify-between px-3 items-center bg-mid py-3 rounded-md mb-4" >
            <h3 className="text-[#bbbbbb] font-bold text-lg">Episode {epNum}</h3>
            <Link to="/server" state={{ servers: qualities }} className="h-full flex items-center w-[2.7em] justify-center">
              <Play />
            </Link>
          </div>
        ))}

      </div>




    </div >


  )
}
export default Episodes;

