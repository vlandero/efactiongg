import { useState } from "react";
import Modal from "../Modal";
import { Button } from "@/components/Button";
import { ButtonWithTooltip } from "../ButtonWithTooltip";
import { FactionRegistryDemo } from "@/models/FactionRegistryDemo.models";
import { ModalSignupProps } from "./ModalSignup.types";
import { FactionRegistryStep } from "./steps/FactionRegistryStep/FactionRegistryStep";
import { PickName } from "./steps/PickName/PickName";
import { PickPictures } from "./steps/PickPictures/PickPictures";
import { PricingStep } from "./steps/PricingStep/PricingStep";
import { pricingPlans } from "@/constants/pricing";
import { CreateAccountStep } from "./steps/CreateAccountStep/CreateAccountStep";
import { FinishStep } from "./steps/FinishStep/FinishStep";

const networkFactionRegistry: FactionRegistryDemo = {
  sections: [
    { id: "1", name: "Region" },
    { id: "2", name: "Division" },
    { id: "3", name: "Team" },
    { id: "4", name: "Roster" },
  ],
  assignments: {
    "3": [{ id: "33", name: "Coach" }, { id: "313", name: "Scout" }, { id: "314", name: "Analyst" }],
    "4": [
      { id: "211", name: "Main" },
      { id: "321312", name: "Subs" },
    ],
  },
};

const orgFactionRegistry: FactionRegistryDemo = {
  sections: [
    { id: "2", name: "Guild" },
    { id: "3", name: "Team" },
    { id: "4", name: "Roster" },
  ],
  assignments: {
    "3": [{ id: "33", name: "Coach" }, { id: "314", name: "Analyst" }],
    "4": [
      { id: "211", name: "Main" },
      { id: "321312", name: "Subs" },
    ],
  },
};

const smallFactionRegistry: FactionRegistryDemo = {
  sections: [
    { id: "4", name: "Team" },
  ],
  assignments: {
    "4": [
      { id: "33", name: "Coach" },
      { id: "211", name: "Main" },
      { id: "321312", name: "Subs" },
    ],
  },
};

export const ModalSignup = ({ onClose }: ModalSignupProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [orgName, setOrgName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [bg, setBg] = useState<string[]>(["#000000"]);
  const [bgDirection, setBgDirection] = useState<"to right" | "to bottom">('to right');
  const [selectedPricingPlanId, setSelectedPricingPlanId] =
    useState<string>("free");
  const [selectedAddonsIds, setSelectedAddonsIds] = useState<string[]>(
    pricingPlans[selectedPricingPlanId].includedAddons
  );
  const [factionRegistry, setFactionRegistry] = useState<FactionRegistryDemo>(
    smallFactionRegistry
  );

  const Intro = () => {
    return (
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-xl mb-2 text-light">
          To begin, choose what best describes your setup.
        </h3>
        <h4 className="text-l mb-2 text-light">
          No stress—you'll be able to tweak everything later. This is just to
          help us point you in the right direction.
        </h4>
        <div className="flex flex-col justify-between h-50 items-center">
          <ButtonWithTooltip
            onClick={() => {
              setFactionRegistry(smallFactionRegistry)
              nextStep()
            }}
            className="w-[250px]"
            label="Small team"
            tooltip="Great for close groups of friends or small teams who just want an easy way to stay organized."
          />
          <ButtonWithTooltip
            onClick={() => {
              setFactionRegistry(orgFactionRegistry)
              nextStep()
            }}
            className="w-[250px]"
            label="Bigger Organization"
            tooltip="Perfect if you’ve got lots of teams or play multiple games—this helps keep everything under control."
          />
          <ButtonWithTooltip
            onClick={() => {
              setFactionRegistry(networkFactionRegistry)
              nextStep()
            }}
            className="w-[250px]"
            label="Gaming Network"
            tooltip="Awesome for big gaming communities where anyone can join, team up, and explore freely."
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      onClose={() => {
        onClose();
        setStep(1);
      }}
      title="Let's get started!"
      extraClassName={[3, 4].includes(step) ? "w-[1100px]" : ""}
    >
      <div>
        {step === 1 && <Intro />}
        {step === 2 && (
          <PickName
            subdomain={subdomain}
            setSubdomain={setSubdomain}
            name={orgName}
            setName={setOrgName}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <PickPictures
            bgDirection={bgDirection}
            setBgDirection={setBgDirection}
            logo={logo}
            setLogo={setLogo}
            bg={bg}
            setBg={setBg}
            nextStep={nextStep}
            prevStep={prevStep}
            orgName={orgName}
          />
        )}
        {step === 4 && (
          <PricingStep
            selectedPlanId={selectedPricingPlanId}
            setSelectedPlanId={setSelectedPricingPlanId}
            setSelectedAddonsIds={setSelectedAddonsIds}
            selectedAddonsIds={selectedAddonsIds}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 5 && (
          <FactionRegistryStep
            factionRegistry={factionRegistry}
            nextStep={nextStep}
            prevStep={prevStep}
            setFactionRegistry={setFactionRegistry}
          />
        )}

        {step === 6 && (
          <CreateAccountStep nextStep={nextStep} prevStep={prevStep} factionUrl={subdomain} />
        )}
        {step === 7 && (<FinishStep onClose={onClose} />)}
      </div>
    </Modal>
  );
};
