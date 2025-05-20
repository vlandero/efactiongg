import { Addon } from "@/components/ModalSignup/steps/PricingStep/components/Addons";
import { Plan } from "@/components/ModalSignup/steps/PricingStep/components/PricingCard";

export const pricingPlans: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0/month",
    features: [
      "Team Page",
      "Up to 10 Members",
      "General Analytics",
      "eFaction Branding",
    ],
    includedAddons: [],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "$25/month",
    features: [
      "Up to 25 Members",
      "Remove eFaction Branding",
      "Team Chat",
      "Custom Domain (coming soon)",
    ],
    includedAddons: ["branding", "chat"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$50/month",
    features: [
      "Unlimited Members",
      "Everything in Premium",
      "Advanced Analytics",
      "Sponsor Section",
      "Priority Support",
      "Forum",
    ],
    includedAddons: ["branding", "support", "analytics", "chat", "forum"],
  },
};

export const pricingAddons: Record<string, Addon> = {
  branding: {
    id: "branding",
    name: "Custom Branding",
    price: "$5",
  },
  chat: {
    id: "chat",
    name: "Team Chat System",
    price: "$4",
  },
  sponsor: {
    id: "sponsor",
    name: "Sponsor Section",
    price: "$4",
  },
  storefront: {
    id: "storefront",
    name: "Team Storefront",
    price: "$4",
  },
  support: {
    id: "support",
    name: "Priority Support",
    price: "$8",
  },
  analytics: {
    id: "analytics",
    name: "Game-Specific Advanced Analytics",
    price: "$11",
  },
  forum: {
    id: "forum",
    name: "Forum",
    price: "$5",
  },
};
