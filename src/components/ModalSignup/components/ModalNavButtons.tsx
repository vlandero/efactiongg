import { PropsWithChildren } from "react";

export const ModalNavButtons = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-between w-[400px] m-auto">{children}</div>
  );
};