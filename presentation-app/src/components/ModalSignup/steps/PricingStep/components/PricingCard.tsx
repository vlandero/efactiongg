import { Check } from "lucide-react";
import cn from "classnames";

export type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  includedAddons: string[];
};

type Props = {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
};

export const PricingCard = ({ plan, selected, onSelect }: Props) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "cursor-pointer border rounded-2xl p-6 w-72 transition-all duration-300",
        selected ? "border-blue-500 shadow-xl scale-105" : "border-zinc-700 hover:border-zinc-500"
      )}
    >
      <h3 className="text-xl font-semibold mb-2 text-light">{plan.name}</h3>
      <p className="text-2xl font-bold text-light mb-4">{plan.price}</p>
      <ul className="text-sm text-zinc-300 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="text-green-400 w-4 h-4" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
