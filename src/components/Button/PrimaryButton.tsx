import React from "react";

type Props = {
  buttonText: string;
  bgColor: string;
  width?: string;
  textColor?: string;
  disabled?: boolean;
  onClick: () => void;
}

const PrimaryButton: React.FC<Props> = ({ buttonText, bgColor, width = "100%", textColor = "#fff", disabled = false, onClick }: Props) => {
  return (
    <button
      className="px-4 py-4 rounded-lg disabled:opacity-50"
      style={{backgroundColor: bgColor, width: width}}
      disabled={disabled}
      onClick={onClick}
    >
      <span style={{color: textColor}}>
        {buttonText}
      </span>
    </button>
  );
};

export default PrimaryButton;