export type PickNameParams = {
    selectedPlanId: string
    setSelectedPlanId: React.Dispatch<React.SetStateAction<string>>;
    selectedAddonsIds: string[]
    setSelectedAddonsIds: React.Dispatch<React.SetStateAction<string[]>>;
    prevStep: () => void
    nextStep: () => void
}