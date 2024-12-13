import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import { searchSymbol } from "../services/stockService";
import SearchResults from "./SearchResults";
// import { SearchIcon, XIcon } from "@heroicons/react/solid";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";


const Search = () => {
  // const { darkMode } = useContext(ThemeContext);

  const [input, setInput] = useState("");

  const [bestMatches, setBestMatches] = useState([]);
  useEffect(() => {
    updateBestMatches()
  }, [input])

  const updateBestMatches = async () => {
    try {
      console.log("Start find stock information.");
      if (input) {
        const searchResults = await searchSymbol(input);
        const result = searchResults.result;
        setBestMatches(result);
      }
    } catch (error) {
      setBestMatches([]);
      console.log(error);
    }
  };

  const clear = () => {
    setInput("");
    setBestMatches([]);
  };

  return (
    <div
    className={`flex items-center my-4 border-2 rounded-md relative z-50 ${
      "bg-gray-900 border-gray-800"
    }`}
    style={{ width: '500px' }} // 设置为500px宽度
    >
      <input
        type="text"
        value={input}
        className={`w-full px-4 py-2 focus:outline-none rounded-md ${
            "bg-gray-900"
        }`}
        placeholder="Search stock..."
        onChange={(event) => setInput(event.target.value)}
      />
      {input && (
        <button onClick={clear} className="m-1">
          <XMarkIcon className="h-4 w-4 fill-gray-500" />
        </button>
      )}
      <button
        onClick={updateBestMatches}
        className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-2 ring-indigo-400"
      >
        <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
      </button>
      {input && bestMatches.length > 0 ? (
        <SearchResults results={bestMatches} />
      ) : null}
    </div>
  );
};

export default Search;
