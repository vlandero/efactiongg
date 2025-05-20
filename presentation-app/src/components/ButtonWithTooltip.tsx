import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { Button } from "./Button";
import { FaInfo } from "react-icons/fa";

export const ButtonWithTooltip = ({
  label,
  tooltip,
  className,
  onClick = () => {},
}: {
  label: string;
  tooltip: string;
  className?: string;
  onClick?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggleTooltip = () => setOpen((prev) => !prev);

  return (
    <div className="flex items-center gap-2">
      <Button className={className} onClick={onClick}>
        {label}
      </Button>

      <Tooltip.Provider>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger asChild>
            <span onClick={toggleTooltip} className="cursor-pointer">
              <FaInfo className="text-[#37a398]" />
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={5}
              className="bg-black text-light text-s px-3 py-2 rounded-md shadow-lg z-50 max-w-[200px]"
            >
              {tooltip}
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};
