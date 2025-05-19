import { Button } from "@/components/Button";
import { FaCheckCircle } from "react-icons/fa";

export const FinishStep = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 text-center text-light max-w-xl mx-auto min-h-[400px]">
            <FaCheckCircle className="text-green-500 text-[100px] animate-bounce" />

            <div>
                <h3 className="text-3xl font-bold mb-2">Setup Complete</h3>
                <p className="text-m text-neutral-400 max-w-md">
                    You’re ready to roll. Everything is set up—just click below to head to your dashboard and start managing your faction.
                </p>
            </div>

            <Button onClick={onClose} className="mt-4 px-6 py-3 text-base">
                Go to Faction
            </Button>
        </div>
    );
};
