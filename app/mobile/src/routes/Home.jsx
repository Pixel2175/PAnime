import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Cards from "../components/Cards";

function Home({ isGrid, setIsGrid }) {
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAnime = async (page) => {
    const res_0 = await fetch(`https://pixelll.is-a.dev/api/anime?page=${page}`);
    const res_1 = await fetch(`https://pixelll.is-a.dev/api/anime?page=${page + 1}`);
    const data_0 = await res_0.json();
    const data_1 = await res_1.json();
    return [...data_0, ...data_1];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["anime", currentPage],
    queryFn: () => fetchAnime(currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (data) {
      setAllData(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newData = data.filter(item => !existingIds.has(item.id));
        return [...prev, ...newData];
      });
    }
  }, [data]);

  useEffect(() => {
    const onScroll = () => {
      if (
        scrollRef.current &&
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 600 &&
        !isLoading
      ) {
        setCurrentPage(prev => prev + 2);
      }
    }
    const div = scrollRef.current
    div?.addEventListener("scroll", onScroll)
    return () => div?.removeEventListener("scroll", onScroll)
  }, [isLoading])

  return (
    <div className="bg-dark text-t-light p-4 pt-10 h-screen w-screen flex flex-col ">
      <Header route="home" isGrid={isGrid} setIsGrid={setIsGrid} />
      <div ref={scrollRef} className="flex-1  mt-4 rounded-md overflow-y-auto">
        {allData.length === 0 && isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-t-light">Loading...</span>
          </div>
        ) : (
          <Cards isGrid={isGrid} data={allData} />
        )}
      </div>
    </div>
  )
}

export default Home;
