export type PickNameParams = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    subdomain: string;
    setSubdomain: React.Dispatch<React.SetStateAction<string>>;
    prevStep: () => void
    nextStep: () => void
}