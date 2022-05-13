import React, { useState } from "react";
import "./Button.scss";

export interface ButtonProps {
  label: string;
}

const Button = (props: ButtonProps) => {
  console.log("hello");

  return <button>Hi bro</button>;
};

export default Button;
