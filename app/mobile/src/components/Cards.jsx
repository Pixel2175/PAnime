import Card from "./Card";

const Cards = ({ isGrid, data }) => {
  return (
    <div className={`grid ${isGrid ? "grid-cols-3  sm:grid-cols-4  lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8  md:grid-cols-5" : "grid-cols-1 sm:grid-cols-2   md:grid-cols-4"} gap-4 p-2`}>
      {data.map((anime) => (
        <Card
          key={anime.id}
          data={anime}
          grid={isGrid}
        />
      ))}
    </div>

  )
}

export default Cards;
