import React, { useContext } from "react";
import { SortTypeContext } from "./WidgetWrapper";

const BridgeTypeSort: React.FC = () => {
  const { sortType, setSortType } = useContext(SortTypeContext);

  return (
    <div className="grid grid-cols-3 gap-1 py-1 px-1 bg-bgLight rounded-lg text-xs">
      <button
        className={`text-fc py-1 px-1 hover:bg-bg3 rounded-lg ${sortType === "output" ? "bg-pr" : ""}`}
        onClick={() => setSortType("output")}
      >
        Max Received
      </button>
      <button
        className={`text-fc py-1 px-1 hover:bg-bg3 rounded-lg ${sortType === "time" ? "bg-pr" : ""}`}
        onClick={() => setSortType("time")}
      >
        Fastest Transfer
      </button>
      <button
        className={`text-fc py-1 px-1 hover:bg-bg3 rounded-lg ${sortType === "gas" ? "bg-pr" : ""}`}
        onClick={() => setSortType("gas")}
      >
        Least Gas
      </button>
    </div>
  );
}

export default BridgeTypeSort;