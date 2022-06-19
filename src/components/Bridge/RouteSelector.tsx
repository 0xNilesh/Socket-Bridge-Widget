import React, { useContext } from "react";
import { RoutesContext, TabIndexContext, TokenDetailsContext } from "./WidgetWrapper";
import DownArrowSvg from "../../assets/down-arrow.svg";
import RouteInfoButton from "./RouteInfoButton";

const RouteSelector: React.FC = () => {
  const { setTabIndex } = useContext(TabIndexContext);
  const { outputTokenDetails } = useContext(TokenDetailsContext);
  const { routes } = useContext(RoutesContext);

  return (
    <div>
      <div className="flex flex-row" id="bridge-header">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgLight hover:cursor-pointer mr-2 text-fc flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{width: 9, height: 14}} />
        </button>
        <div className="grow text-center text-xl text-fc font-medium">
          Bridge
        </div>
      </div>
      <div className="h-3"></div>
      <div className="h-4"></div>
      <div className="grid grid-cols-5 gap-4 px-4 text-xs text-bg3 font-normal">
        <div>Bridge</div>
        <div>Receive ({outputTokenDetails.symbol})</div>
        <div>Bridge Fee</div>
        <div>Gas Fee</div>
        <div>Time</div>
      </div>
      <div className="h-3"></div>
      <div className="flex flex-col">
        {routes.map((route) => {
          return (
            <div>
              <RouteInfoButton route={route} />
              <div className="h-2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSelector;