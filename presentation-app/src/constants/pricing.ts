import { Addon } from "@/components/ModalSignup/steps/PricingStep/components/Addons";
import { Plan } from "@/components/ModalSignup/steps/PricingStep/components/PricingCard";

export const pricingPlans: Record<string, Plan> = {
    free: {
        id: "free",
        name: "Free",
        price: "$0/month",
        features: ["Basic Stats", "Team Page"],
        includedAddons: [],
    },
    pro: {
        id: "pro",
        name: "Pro",
        price: "$12/month",
        features: ["Advanced Stats", "Custom Branding", "Email Reports"],
        includedAddons: ["branding"],
    },
    elite: {
        id: "elite",
        name: "Elite",
        price: "$29/month",
        features: ["Everything in Pro", "Priority Support", "White Label"],
        includedAddons: ["branding", "support"],
    },
  };

export const pricingAddons: Record<string, Addon> = {
    branding: { id: "branding", name: "Custom Branding", price: "$5" },
    support: { id: "support", name: "Priority Support", price: "$10" },
};