import { Plan } from "./PricingCard";

export type Addon = { id: string; name: string; price: string }

type Props = {
    addons: Addon[];
    selectedPlan: Plan;
    selectedAddons: string[];
    toggleAddon: (id: string) => void;
};

export const Addons = ({ addons, selectedPlan, selectedAddons, toggleAddon }: Props) => {
    return (
        <div className="space-y-4 mt-8 w-full max-w-2xl">
            <h4 className="text-light text-lg font-semibold">Extra Features</h4>
            {addons.map((addon) => {
                const included = selectedPlan.includedAddons.includes(addon.id);
                const checked = included || selectedAddons.includes(addon.id);

                return (
                    <label
                        key={addon.id}
                        className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg bg-zinc-900"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={included}
                                onChange={() => toggleAddon(addon.id)}
                            />
                            <span className="text-light">{addon.name}</span>
                        </div>
                        <span className="text-zinc-400">{included ? "Included" : addon.price}</span>
                    </label>
                );
            })}
        </div>
    );
};
