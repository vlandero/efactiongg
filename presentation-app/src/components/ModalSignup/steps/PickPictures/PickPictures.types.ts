export interface PickPicturesParams {
  logo: string | null;
  setLogo: (value: string | null) => void;
  bg: string | null;
  setBg: (value: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  orgName: string;
}
