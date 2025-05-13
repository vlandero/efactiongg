import { PropsWithChildren } from "react";

type ButtonProps = {
  onClick: () => void;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  className = "",
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className={`button-primary text-white py-3 px-8 text-lg rounded-md transition-all duration-300 hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
};
