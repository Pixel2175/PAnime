import Header from "../components/Header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Cards from "../components/Cards";

function Home({ isGrid, setIsGrid }) {

  const scrollRef = useRef(null);

  const fetchAnime = async ({ pageParam = 1 }) => {
    let data = []
    const res_0 = await fetch(`https://pixelll.is-a.dev/api/anime?page=${pageParam}`);
    const res_1 = await fetch(`https://pixelll.is-a.dev/api/anime?page=${pageParam + 1}`);
    data.push(await res_0.json());
    data.push(await res_1.json());
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["anime"],
    queryFn: fetchAnime,
    getNextPageParam: (pages) => pages.length + 2,
  });

  const allData = data?.pages?.flatMap(page => page.flatMap(page => page)) || [];

  useEffect(() => {
    const onScroll = () => {
      if (
        scrollRef.current &&
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 600 &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    }
    const div = scrollRef.current
    div?.addEventListener("scroll", onScroll)
    return () => div?.removeEventListener("scroll", onScroll)
  }, [fetchNextPage, hasNextPage])

  return (
    <div className="bg-dark text-t-light p-4 pt-10 h-screen w-screen flex flex-col ">
      <Header route="home" isGrid={isGrid} setIsGrid={setIsGrid} />
      <div ref={scrollRef} className="flex-1  mt-4 rounded-md overflow-y-auto">
        {isLoading ? (
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
