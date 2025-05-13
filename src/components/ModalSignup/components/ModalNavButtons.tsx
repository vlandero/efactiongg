import { PropsWithChildren } from "react";

export const ModalNavButtons = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-between w-[100%] max-w-[500px] m-auto">{children}</div>
  );
};