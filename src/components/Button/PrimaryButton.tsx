import React from "react";
import LoadingSvg from "../../assets/loading.svg";

type Props = {
  buttonText: string;
  bgColor: string;
  width?: string;
  loading?: boolean,
  textColorPrimary?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const PrimaryButton: React.FC<Props> = ({ buttonText, bgColor, width = "100%", loading= false, textColorPrimary = "#fff", disabled = false, onClick }: Props) => {
  return (
    <button
      className="px-4 py-4 rounded-lg disabled:opacity-75 disabled:cursor-not-allowed text-base font-medium"
      style={{backgroundColor: bgColor, width: width}}
      disabled={disabled}
      onClick={onClick}
    >
      <span style={{color: textColorPrimary}}>
        {loading && <LoadingSvg className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-textColorPrimary" />} {buttonText}
      </span>
    </button>
  );
};

export default PrimaryButton;