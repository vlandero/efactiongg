import { Button } from "@/components/Button";
import { ModalSignup } from "@/components/ModalSignup/ModalSignup";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { pricingPlans } from "@/constants/pricing";
import Logo from "@/components/Logo";

export default function Home() {
  const [modalSignupOpen, setModalSignupOpen] = useState(false);

  useEffect(() => {
    if (modalSignupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalSignupOpen]);

  return (
    <div className="scroll-smooth">
      <Logo />

      <section className="h-[50vh] bg-primary-gradient flex flex-row justify-center">
        <div className="h-full w-[90%] max-w-[1700px] text-white grid grid-cols-1 md:grid-cols-2 text-center px-4 gap-10 py-16">
          <div className="flex items-center justify-center rounded-2xl glass-panel flex-col p-6 shadow-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              All your teams, one place.
            </h1>
            <p className="text-lg max-w-md mb-6">
              Manage your entire organization from a single dashboard—no chaos,
              no confusion.
            </p>
          </div>
          <div className="flex items-center justify-center glass-panel rounded-2xl flex-col p-6 shadow-md">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One platform. Endless control.
            </h2>
            <p className="text-lg max-w-md mb-6">
              From rosters to results, keep everything in sync with powerful
              team tools.
            </p>
            <Button onClick={() => setModalSignupOpen(true)}>
              Get Started for free!
            </Button>
          </div>
        </div>
      </section>

      <section className="h-[50vh] secondary-gradient flex flex-row justify-center">
        <div className="h-full w-[90%] max-w-[2500px] text-white grid grid-cols-1 md:grid-cols-5 text-center px-4 py-16 gap-8">
          <div className="md:col-span-3 flex flex-col glass-panel items-center justify-center p-6 rounded-2xl shadow-md bg-white/5">
            <h2 className="text-2xl font-bold mb-2">Your Own Analyst</h2>
            <p className="text-lg font-medium max-w-md text-zinc-100">
              Track performance trends, identify weaknesses, and get smarter
              with every match. Get post-match reports automatically and
              data-driven insights to improve faster.
            </p>
          </div>
          <div className="md:col-span-1 flex flex-col glass-panel items-center justify-center p-6 rounded-2xl shadow-md bg-white/5">
            <h2 className="text-2xl font-bold mb-2">Plug & Play Growth</h2>
            <p className="text-lg font-medium text-zinc-100">
              Expand your team structure or game coverage effortlessly as you
              scale.
            </p>
          </div>
          <div className="md:col-span-1 flex flex-col glass-panel items-center justify-center p-6 rounded-2xl shadow-md bg-white/5">
            <h2 className="text-2xl font-bold mb-2">
              Effortless Collaboration
            </h2>
            <p className="text-lg font-medium text-zinc-100">
              Bring coaches, players, and staff together in a seamless and
              transparent workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-[50vh] bg-zinc-900 text-white px-6 py-12 overflow-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Pricing Plans</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {Object.values(pricingPlans).map((plan) => (
            <div
              key={plan.id}
              className="border border-zinc-700 rounded-3xl p-8 w-[300px] sm:w-[340px] md:w-[380px] shadow-xl hover:shadow-2xl transition-all duration-300 bg-zinc-800"
            >
              <h3 className="text-2xl font-semibold mb-2 text-white">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold text-blue-400 mb-4">
                {plan.price}
              </p>
              <ul className="text-base text-zinc-300 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="text-green-400 w-5 h-5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {modalSignupOpen && (
        <ModalSignup onClose={() => setModalSignupOpen(false)} />
      )}
    </div>
  );
}
