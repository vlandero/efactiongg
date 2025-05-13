import { useState } from "react";
import Modal from "../Modal";
import { Button } from "@/components/Button";
import { ButtonWithTooltip } from "../ButtonWithTooltip";
import { FactionRegistry } from "@/models/FactionRegistry.models";
import { ModalSignupProps } from "./ModalSignup.types";
import { ModalNavButtons } from "./components/ModalNavButtons";
import { FactionRegistryStep } from "./steps/FactionRegistryStep/FactionRegistryStep";

const defaultFactionRegistry: FactionRegistry = {
  sections: ["House", "Division", "Team", "Roster"],
  assignments: { "Team": ["Coach"], "Roster": ["Main", "Subs"] },
};

const emptyFactionRegistry: FactionRegistry = {
  sections: [],
  assignments: {},
};

export const ModalSignup = ({ onClose }: ModalSignupProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [orgName, setOrgName] = useState("");
  const [factionRegistry, setFactionRegistry] = useState<FactionRegistry>(
    defaultFactionRegistry
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
            onClick={nextStep}
            className="w-[250px]"
            label="Small team"
            tooltip="Great for close groups of friends or small teams who just want an easy way to stay organized."
          />
          <ButtonWithTooltip
            onClick={nextStep}
            className="w-[250px]"
            label="Bigger Organization"
            tooltip="Perfect if you’ve got lots of teams or play multiple games—this helps keep everything under control."
          />
          <ButtonWithTooltip
            onClick={nextStep}
            className="w-[250px]"
            label="Gaming Network"
            tooltip="Awesome for big gaming communities where anyone can join, team up, and explore freely."
          />
        </div>
      </div>
    );
  };

  const PickName = () => {
    return (
      <div className="flex flex-col gap-[30px]">
        <h3 className="text-xl text-light">Name Your Organization</h3>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-[300px] p-2 m-auto text-black rounded-md input"
        />
        <h4 className="text-light">This is part of the branding </h4>
        <ModalNavButtons>
          <Button onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next</Button>
        </ModalNavButtons>
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
    >
      <div>
        {step === 1 && <Intro />}

        {step === 2 && (
          <FactionRegistryStep
            factionRegistry={factionRegistry}
            nextStep={nextStep}
            prevStep={prevStep}
            setFactionRegistry={setFactionRegistry}
          />
        )}

        {step === 10 && (
          <div>
            <h3 className="text-xl mb-2 text-light">Create Your Account</h3>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <Button onClick={nextStep}>Next</Button>
          </div>
        )}
        {/* branding */}
        {step === 5 && (
          <div>
            <h3 className="text-xl mb-2 text-light">Congratulations!</h3>
            <p>You've completed the setup. Click below to proceed.</p>
            <Button onClick={onClose}>Go to Dashboard</Button>
          </div>
        )}
        {step === 7 && <PickName />}
        {step === 6 && (
          <div>
            <h3 className="text-xl mb-2 text-light">
              Upload a Picture (Optional)
            </h3>
            <input type="file" className="w-full mb-4" />
            <Button onClick={nextStep}>Next</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
