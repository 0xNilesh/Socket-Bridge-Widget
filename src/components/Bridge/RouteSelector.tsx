import React, { useContext } from "react";
import { TabIndexContext } from "./WidgetWrapper";

const RouteSelector = () => {
  const { setTabIndex } = useContext(TabIndexContext);

  return (
    <div>
      Bridge
      <button
        className="text-fc"
        onClick={() => setTabIndex(0)}
      >Back</button>
    </div>
  );
};

export default RouteSelector;