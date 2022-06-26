import React, { useContext } from "react";
import { SortTypeContext, WidgetWidthContext } from "../../contexts";

const BridgeTypeSort: React.FC = () => {
  const { widgetWidth } = useContext(WidgetWidthContext);
  const { sortType, setSortType } = useContext(SortTypeContext);

  return (
    <div
      className={`${widgetWidth > 250 ? 'grid grid-cols-3' : 'flex flex-col'} gap-1 py-1 px-1 bg-bgColorSecondary rounded-lg text-xs`}
    >
      <button
        className={`text-textColorPrimary py-1 px-1 hover:bg-textColorSecondary rounded-lg ${sortType === "output" ? "bg-bgColorPrimary" : ""}`}
        onClick={() => setSortType("output")}
      >
        Max Received
      </button>
      <button
        className={`text-textColorPrimary py-1 px-1 hover:bg-textColorSecondary rounded-lg ${sortType === "time" ? "bg-bgColorPrimary" : ""}`}
        onClick={() => setSortType("time")}
      >
        Fastest Transfer
      </button>
      <button
        className={`text-textColorPrimary py-1 px-1 hover:bg-textColorSecondary rounded-lg ${sortType === "gas" ? "bg-bgColorPrimary" : ""}`}
        onClick={() => setSortType("gas")}
      >
        Least Gas
      </button>
    </div>
  );
}

export default BridgeTypeSort;