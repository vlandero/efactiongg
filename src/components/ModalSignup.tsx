import { useState } from 'react';
import Modal from './Modal';
import { Button } from '@/components/Button';
import { FaInfo } from "react-icons/fa";
import { ButtonWithTooltip } from './ButtonWithTooltip';

type ModalSignupProps = {
    onClose: () => void
}

export const ModalSignup = ({ onClose }: ModalSignupProps) => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <Modal onClose={() => { onClose(); setStep(1); }} title="Let's get started!">
            <div>
                {step === 1 && (
                    <div className='flex flex-col gap-[10px]'>
                        <h3 className="text-xl mb-2 text-light">To begin, choose what best describes your setup.</h3>
                        <h4 className="text-l mb-2 text-light">No stress—you'll be able to tweak everything later. This is just to help us point you in the right direction.</h4>
                        <div className='flex flex-col justify-between h-50 items-center'>
                            <ButtonWithTooltip className='w-[250px]' label='Small team' tooltip='Great for close groups of friends or small teams who just want an easy way to stay organized.' />
                            <ButtonWithTooltip className='w-[250px]' label='Bigger Organization' tooltip='Perfect if you’ve got lots of teams or play multiple games—this helps keep everything under control.' />
                            <ButtonWithTooltip className='w-[250px]' label='Gaming Network' tooltip='Awesome for big gaming communities where anyone can join, team up, and explore freely.' />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-xl mb-2 text-light">Name Your Organization</h3>
                        <input
                            type="text"
                            placeholder="Organization Name"
                            className="w-full p-2 mb-4 text-black rounded-md"
                        />
                        <Button onClick={nextStep}>Next</Button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 className="text-xl mb-2 text-light">Upload a Picture (Optional)</h3>
                        <input type="file" className="w-full mb-4" />
                        <Button onClick={nextStep}>Next</Button>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 className="text-xl mb-2 text-light">Faction Registry</h3>
                        <p>Set up how you want players to join and be organized in your faction.</p>
                        <Button onClick={nextStep}>Set Up Faction</Button>
                    </div>
                )}

                {step === 5 && (
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
                        <Button onClick={nextStep} >Next</Button>
                    </div>
                )}

                {step === 6 && (
                    <div>
                        <h3 className="text-xl mb-2 text-light">Congratulations!</h3>
                        <p>You've completed the setup. Click below to proceed.</p>
                        <Button onClick={onClose}>Go to Dashboard</Button>
                    </div>
                )}

            </div>
        </Modal>
    );
};