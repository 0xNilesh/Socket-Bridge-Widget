import React, { useContext, useEffect, useState } from "react";
import DownArrowSvg from "../../assets/down-arrow.svg";
import RouteInfoButton from "./RouteInfoButton";
import { PrimaryButton } from "../Button";
import { RoutesContext, TabIndexContext, TokenDetailsContext, WidgetWidthContext } from "../../contexts";

const RouteSelector: React.FC = () => {
  const { setTabIndex } = useContext(TabIndexContext);
  const { widgetWidth } = useContext(WidgetWidthContext);
  const { outputTokenDetails } = useContext(TokenDetailsContext);
  const { routes, selectedRoute, setSelectedRoute } = useContext(RoutesContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    routes.map((route, index) => {
      if (route === selectedRoute) {
        setSelectedIndex(index);
        return;
      }
    })
  }, [routes]);

  const saveSelectedRoute = () => {
    setSelectedRoute(routes[selectedIndex]);
    setTabIndex(0);
  }

  // console.log(selectedRoute);

  return (
    <div>
      <div className="flex flex-row" id="bridge-header">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgColorSecondary hover:cursor-pointer mr-2 text-textColorPrimary flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{width: 9, height: 14}} />
        </button>
        <div className="grow text-center text-xl text-textColorPrimary font-medium">
          Bridge
        </div>
      </div>
      <div className="h-3"></div>
      <div className="h-4"></div>
      {widgetWidth > 500 &&
        <>
          <div className="grid grid-cols-5 gap-4 px-4 text-xs text-textColorSecondary font-normal">
            <div>Bridge</div>
            <div>Receive ({outputTokenDetails.symbol})</div>
            <div>Bridge Fee</div>
            <div>Gas Fee</div>
            <div>Time</div>
          </div>
          <div className="h-3"></div>
        </>
      }
      <div className="flex flex-col">
        {routes.map((route, index) => {
          return (
            <div key={index}>
              <RouteInfoButton
                route={route}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                index={index}
              />
              <div className="h-2"></div>
            </div>
          );
        })}
      </div>
      <div className="h-4"></div>
      <div className="h-3"></div>
      <div>
        <PrimaryButton
          buttonText="Save for this transfer"
          bgColor={getComputedStyle(document.documentElement)
    .getPropertyValue('--btnColorSecondary')}
          onClick={saveSelectedRoute}
        />
      </div>
    </div>
  );
};

export default RouteSelector;