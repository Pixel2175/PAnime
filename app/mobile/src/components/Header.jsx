import { LayoutGrid, Send, Search, ArrowLeft, List } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ isGrid, setIsGrid, setAnimeName, route, reversed, setReversed, yes }) => {
  const [search, setSearch] = useState("");


  return (
    <header className="bg-mid flex items-center justify-between px-4  w-full h-11 rounded-md  text-t-light">
      {route === "home" ? (
        <Link to="/search"  ><Search className="text-t-light" size={22} /></Link>
      ) : route === "search" ? (
        <>
          <Link to="/" ><ArrowLeft /></Link>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-mid w-full mx-4 text-t-light px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-t-light transition-all duration-150"
          />
          <button className="mx-2" onClick={() => setAnimeName(search)}><Send size={23} /></button>
        </>

      ) : null
      }

      {route != "back" ? (

        <div className="relative">
          <List onClick={() => { setIsGrid((p) => !p) }} className={`${isGrid ? "opacity-0" : "opacity-100"} transition-opacity duration-150    absolute`} size={23} />
          <LayoutGrid onClick={() => { setIsGrid((p) => !p) }} className={`${!isGrid ? "opacity-0" : "opacity-100"} transition-opacity duration-150 `} size={23} />
        </div>
      ) : route === "back" ? (
        <div className="flex items-center justify-between w-full">
          <Link to={-1} className="text-t-light"><ArrowLeft size={24} /></Link>

          {yes == true ? (

            <div className="relative">
              <List onClick={() => { setReversed((p) => !p) }} className={`${reversed ? "opacity-0" : "opacity-100"} transition-opacity duration-150    absolute`} size={23} />
              <LayoutGrid onClick={() => { setReversed((p) => !p) }} className={`${!reversed ? "opacity-0" : "opacity-100"} transition-opacity duration-150 `} size={23} />
            </div>
          ) : null}


        </div>

      ) : null}


    </header>
  );
};
export default Header;
