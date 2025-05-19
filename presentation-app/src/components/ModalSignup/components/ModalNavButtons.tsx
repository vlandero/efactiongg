import { PropsWithChildren } from "react";
import cn from 'classnames'

export const ModalNavButtons = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn("flex justify-between w-[100%] max-w-[500px] m-auto", className)}>{children}</div>
  );
};