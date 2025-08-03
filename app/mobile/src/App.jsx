import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./routes/Home"
import Search from "./routes/Search"
import Details from "./routes/Details"
import Episodes from "./routes/Episodes"
import Server from "./routes/Server"
import Player from "./routes/Player"
import { StatusBar } from "@capacitor/status-bar";


const App = () => {
  const [isGrid, setIsGrid] = useState(true);

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true });
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isGrid={isGrid} setIsGrid={setIsGrid} />} />
        <Route path="/search" element={<Search isGrid={isGrid} setIsGrid={setIsGrid} />} />
        <Route path="/details" element={<Details />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route path="/server" element={<Server />} />
        <Route path="/player" element={<Player />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
