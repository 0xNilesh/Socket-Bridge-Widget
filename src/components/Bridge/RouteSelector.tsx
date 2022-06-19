import React, { useContext } from "react";
import { TabIndexContext } from "./WidgetWrapper";
import DownArrowSvg from "../../assets/down-arrow.svg";

const RouteSelector = () => {
  const { setTabIndex } = useContext(TabIndexContext);

  return (
    <div>
      <div className="flex flex-row">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgLight hover:cursor-pointer mr-2 text-fc flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{width: 9, height: 14}} />
        </button>
        <div className="grow text-center text-base text-fc font-medium">
          Bridge
        </div>
      </div>
    </div>
  );
};

export default RouteSelector;