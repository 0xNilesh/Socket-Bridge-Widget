import React, { useRef } from "react";
import { useClickAway } from "../../hooks";

type Props = {
  options: Array<{ chainId: number, name: string, icon: string }>;
  setChain: (chainId: number) => void;
  onHide: (value: boolean) => void;
}

const ChainSelectDropdown = ({ options, setChain, onHide }: Props) => {
  const clickAwayRef = useRef<HTMLDivElement>(null);

  useClickAway(clickAwayRef, () => onHide(true));

  return (
    <div ref={clickAwayRef} className="absolute text-fc bg-bg2 top-14 left-4 py-2 rounded-lg" style={{ width: "220px" }}>
      {options.map((option) => {
        return (
          <div
            className="flex mx-2 p-1 rounded-lg h-10 items-center text-sm font-medium hover:cursor-pointer hover:bg-bgLight"
            onClick={() => {
              setChain(option.chainId);
              onHide(true);
            }}
            key={option.chainId}
          >
            <img src={option.icon} className="w-5 h-5 rounded-md mr-2" />
            <div>{option.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ChainSelectDropdown;