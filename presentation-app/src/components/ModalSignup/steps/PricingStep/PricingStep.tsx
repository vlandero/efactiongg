import { Addons } from "@/components/ModalSignup/steps/PricingStep/components/Addons";
import { PricingCard } from "@/components/ModalSignup/steps/PricingStep/components/PricingCard";
import { useMemo } from "react";
import { PickNameParams } from "./PricingStep.types";
import { pricingAddons, pricingPlans } from "@/constants/pricing";
import { ModalNavButtons } from "../../components/ModalNavButtons";
import { Button } from "@/components/Button";

export const PricingStep = ({ selectedPlanId, setSelectedPlanId, selectedAddonsIds, setSelectedAddonsIds, prevStep, nextStep }: PickNameParams) => {

    const selectedPlan = useMemo(() => pricingPlans[selectedPlanId], [selectedPlanId]);

    const toggleAddon = (id: string) => {
        if (selectedPlan!.includedAddons.includes(id)) return;

        setSelectedAddonsIds(prev =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col items-center gap-12 p-8">
            <h2 className="text-2xl font-bold text-light">Choose Your Plan</h2>
            <div className="flex flex-wrap justify-center gap-6">
                {Object.values(pricingPlans).map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        selected={selectedPlanId === plan.id}
                        onSelect={() => setSelectedPlanId(plan.id)}
                    />
                ))}
            </div>

            <Addons
                addons={Object.values(pricingAddons)}
                selectedPlan={selectedPlan}
                selectedAddons={selectedAddonsIds}
                toggleAddon={toggleAddon}
            />
            <ModalNavButtons>
                <Button className="w-40" onClick={prevStep}>Back</Button>
                <Button className="w-40" onClick={nextStep}>Next</Button>
            </ModalNavButtons>
        </div>
    );
};
