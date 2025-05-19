export interface PickPicturesParams {
  logo: string | null;
  setLogo: (value: string | null) => void;
  bg: string[];
  setBg: (value: string[]) => void;
  bgDirection: "to right" | "to bottom";
  setBgDirection: (value: "to right" | "to bottom") => void;
  nextStep: () => void;
  prevStep: () => void;
  orgName: string;
}
