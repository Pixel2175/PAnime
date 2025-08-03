import { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";

const Search = ({ isGrid, setIsGrid }) => {
  const [animeName, setAnimeName] = useState("");
  const [animeContent, setAnimeContent] = useState([]);

  useEffect(() => {
    fetch(`https://pixelll.is-a.dev/api/anime?query=${animeName}`)
      .then(res => res.json())
      .then(data => {
        setAnimeContent(data)
      })
      .catch(err => console.error("Error fetching anime:", err));

  }, [animeName])

  return (
    <div className="bg-dark pt-10 text-t-light p-4 h-screen w-screen flex flex-col ">
      <Header isGrid={isGrid} setIsGrid={setIsGrid} setAnimeName={setAnimeName} route="search" />
      <div className="flex-1  mt-4 rounded-md overflow-y-auto">
        <Cards isGrid={isGrid} data={animeContent} />
      </div>

    </div>
  )

}

export default Search;
