import { Button } from "@/components/Button";
import { useState } from "react";
import { ModalNavButtons } from "../../components/ModalNavButtons";

export const CreateAccountStep = ({ nextStep, prevStep, factionUrl }: { nextStep: () => void, prevStep: () => void, factionUrl: string }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isFormValid = username && email && password;

    return (
        <div className="flex flex-col gap-5 max-w-md mx-auto text-light">
            <div>
                <h3 className="text-2xl font-semibold mb-1">Create Your Faction Account</h3>
                <p className="text-sm text-neutral-400">
                    This will be your admin account, used to access your faction at <i><b>{factionUrl}.efaction.gg</b></i>
                </p>
            </div>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-800 text-light p-3 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 text-light p-3 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 text-light p-3 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />

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
