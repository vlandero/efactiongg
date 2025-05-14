import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ModalNavButtons } from "@/components/ModalSignup/components/ModalNavButtons";
import { PickNameParams } from "./PickName.types";

export const PickName = ({ name, nextStep, prevStep, setName, subdomain, setSubdomain }: PickNameParams) => {
    const [subdomainTouched, setSubdomainTouched] = useState(false);

    useEffect(() => {
        if (!subdomainTouched) {
            const sanitized = name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            setSubdomain(sanitized);
        }
    }, [name]);

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        setSubdomainTouched(true);
        setSubdomain(value);
    };


    return (
        <div className="flex flex-col items-center gap-8 text-light">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold">Name Your Organization</h3>
                <p className="text-l text-zinc-400 max-w-md">
                    This will be part of your branding and subdomain — you can change it later.
                </p>
            </div>

            <div className="space-y-6 w-full max-w-md">
                <label className="flex flex-col">
                    <span className="mb-1 text-m text-zinc-300">Organization Name</span>
                    <input
                        type="text"
                        placeholder="e.g. Red Falcons 23"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-dark"
                    />
                </label>

                <label className="flex flex-col mb-1">
                    <span className="mb-1 text-m text-zinc-300">Subdomain</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={subdomain}
                            onChange={handleSubdomainChange}
                            placeholder="redfalcons"
                            className="flex-1 input-dark"
                        />
                        <span className="text-m text-zinc-400">.efaction.gg</span>
                    </div>
                </label>
                <span className="text-sm text-gray-400 italic">Custom domain coming soon</span>
            </div>

            <ModalNavButtons>
                <Button className="w-40" onClick={prevStep}>
                    Back
                </Button>
                <Button className="w-40" onClick={nextStep} disabled={!name.trim() || !subdomain}>
                    Next
                </Button>
            </ModalNavButtons>
        </div>
    );
};
