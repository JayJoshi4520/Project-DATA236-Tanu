import React, { useContext, useState } from "react";
import StockContext from "../context/StockContext";
import ThemeContext from "../context/ThemeContext";

const SearchResults = ({ results }) => {
  // const { darkMode } = useContext(ThemeContext);
  const { setStockSymbol } = useContext(StockContext);

  const [isVisible, setIsVisible] = useState(true);

  const handleOptionClick = (symbol) => {
    setStockSymbol(symbol);
    localStorage.setItem("ticker", symbol);
    setIsVisible(false);
  };

  return (
    isVisible && (
      <ul
        className={`absolute top-12 border-2 w-full rounded-md h-64 overflow-y-scroll ${
          "bg-gray-900 border-gray-800 custom-scrollbar custom-scrollbar-dark"
        }`}
      >
        {results.map((item) => (
          <li
            key={item.symbol}
            className={`cursor-pointer p-4 m-3 flex items-center justify-between rounded-md ${
                "hover:bg-indigo-600" 
            } transition duration-300`}
            onClick={() => handleOptionClick(item.symbol)}
          >
            <span>{item.symbol}</span>
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    )
  );
};

export default SearchResults;
