import { useLocation, Link } from "react-router-dom";
import { Play } from "lucide-react";
import Header from "../components/Header";

const Server = () => {
  const { state } = useLocation();
  const cover = state?.cover;
  const grouped = {};

  Object.entries(state?.servers || {}).forEach(([q, p]) =>
    Object.entries(p).forEach(([prov, url]) => {
      grouped[prov] ??= {};
      grouped[prov][q] = url;
    })
  );

  return (
    <div className="bg-dark pt-10 text-t-light p-4 h-screen w-screen flex flex-col">
      <Header route="back" />
      <h1 className="text-3xl font-bold text-center mt-12 mb-2">Servers</h1>

      <div className="flex-1 mt-4 overflow-y-auto px-4">
        {Object.entries(grouped).map(([prov, qUrls]) => (
          <div key={prov} className="bg-mid p-4 rounded mb-4">
            <h2 className="text-xl font-bold mb-3">{prov}:</h2>
            {Object.entries(qUrls).map(([q, url]) => (
              <div key={q} className="flex justify-between items-center mb-2 bg-dark p-2 rounded">
                <span className="text-lg">{q.toUpperCase()}</span>
                <Link to="/player" state={{ url, cover: cover }}>

                  <Play className="cursor-pointer" />
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Server;

