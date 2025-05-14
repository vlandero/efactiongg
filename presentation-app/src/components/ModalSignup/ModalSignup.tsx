import { useState } from "react";
import Modal from "../Modal";
import { Button } from "@/components/Button";
import { ButtonWithTooltip } from "../ButtonWithTooltip";
import { FactionRegistryDemo } from "@/models/FactionRegistryDemo.models";
import { ModalSignupProps } from "./ModalSignup.types";
import { ModalNavButtons } from "./components/ModalNavButtons";
import { FactionRegistryStep } from "./steps/FactionRegistryStep/FactionRegistryStep";
import { PickName } from "./steps/PickName/PickName";
import { PickPictures } from "./steps/PickPictures/PickPictures";

const defaultFactionRegistry: FactionRegistryDemo = {
  sections: [{ id: '1', name: "House" }, { id: '2', name: "Division" }, { id: '3', name: "Team" }, { id: '4', name: "Roster" }],
  assignments: { "3": [{ id: '33', name: "Coach" }], "4": [{ id: '211', name: "Main" }, { id: '321312', name: "Subs" }] },
};

export const ModalSignup = ({ onClose }: ModalSignupProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [orgName, setOrgName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [bg, setBg] = useState<string | null>(null);
  const [factionRegistry, setFactionRegistry] = useState<FactionRegistryDemo>(
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
        {step === 2 && <PickName subdomain={subdomain} setSubdomain={setSubdomain} name={orgName} setName={setOrgName} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <PickPictures logo={logo} setLogo={setLogo} bg={bg} setBg={setBg} nextStep={nextStep} prevStep={prevStep} />}

        {step === 4 && (
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
