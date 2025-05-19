import { useState } from "react";
import { Button } from "@/components/Button";
import { ModalNavButtons } from "../../components/ModalNavButtons";
import cn from 'classnames'

const JOIN_METHODS = [
    {
        key: "invite",
        title: "Invite Only",
        description: "Players can only join through direct invites from an admin.",
    },
    {
        key: "invite_link",
        title: "Invite Link",
        description: "Anyone with the link can join your faction directly.",
    },
    {
        key: "open",
        title: "Create Account & Join",
        description: "Players can search and join your faction by themselves.",
    },
    {
        key: "open_with_approval",
        title: "Create Account & Join (With Approval)",
        description: "Players can apply to join your faction and you approve them.",
    },
];

export const JoinStep = ({
    nextStep,
    prevStep,
    joinMethod,
    setJoinMethod
}: {
    nextStep: () => void;
    prevStep: () => void;
    joinMethod: string;
    setJoinMethod: (method: string) => void;
}) => {

    return (
        <div className="flex flex-col gap-5 max-w-md mx-auto text-light">
            <div>
                <h3 className="text-2xl font-semibold mb-1">How Can Players Join?</h3>
                <p className="text-sm text-neutral-400">
                    Choose how players should be able to join your organization.
                </p>
            </div>

            <div className="space-y-3">
                {JOIN_METHODS.map((method) => {
                    const isSelected = joinMethod === method.key;
                    return (
                        <button
                            key={method.key}
                            onClick={() => setJoinMethod(method.key)}
                            className={cn(
                                "w-full text-left p-4 rounded-md border transition-all duration-300 ease-in-out transform",
                                isSelected
                                    ? "bg-primary border-primary text-white scale-[1.02] shadow-xl"
                                    : "bg-neutral-800 border-neutral-700 hover:border-primary hover:scale-[1.01]"
                            )}
                        >
                            <h4 className="font-semibold">{method.title}</h4>
                            <p className="text-sm text-neutral-400">{method.description}</p>
                        </button>
                    );
                })}
            </div>

            <ModalNavButtons>
                <Button className="w-40" onClick={prevStep}>
                    Back
                </Button>
                <Button className="w-40" onClick={nextStep}>
                    Next
                </Button>
            </ModalNavButtons>
        </div>
    );
};
