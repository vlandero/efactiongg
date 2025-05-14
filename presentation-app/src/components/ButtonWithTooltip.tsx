import * as Tooltip from "@radix-ui/react-tooltip";
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
}) => (
  <div className="flex items-center gap-2">
    <Button className={className} onClick={onClick}>
      {label}
    </Button>

    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="cursor-pointer">
            <FaInfo className="text-[#37a398]" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={5}
            className="bg-black text-light text-xs px-3 py-2 rounded-md shadow-lg z-50 max-w-[200px]"
          >
            {tooltip}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  </div>
);
