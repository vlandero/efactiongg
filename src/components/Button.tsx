import { PropsWithChildren } from "react";

type ButtonProps = {
    onClick: () => void;
    bgColor?: string;
    textColor?: string;
    className?: string;
};

export const Button = ({ children, onClick, bgColor = 'bg-secondary', textColor = 'text-white', className = '' }: ButtonProps & PropsWithChildren) => {
    return (
        <button
            onClick={onClick}
            className={`${bgColor} ${textColor} py-3 px-8 text-lg rounded-md ${className} transition-all duration-300 hover:opacity-90`}
        >
            {children}
        </button>
    );
};