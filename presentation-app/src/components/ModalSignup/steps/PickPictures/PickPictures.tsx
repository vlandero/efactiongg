import { useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/Button";
import { ModalNavButtons } from "@/components/ModalSignup/components/ModalNavButtons";
import { PickPicturesParams } from "./PickPictures.types";
import { getCroppedImg } from "@/utils/cropImage";
import { Header } from "../../components/Header";
import { X } from "lucide-react";
import LoginPreview from "../../components/LoginPreview";

export const PickPictures = ({
  logo,
  setLogo,
  bg,
  setBg,
  nextStep,
  prevStep,
  orgName,
  bgDirection,
  setBgDirection
}: PickPicturesParams) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropping, setCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const showCropper = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const completeCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(
      imageToCrop,
      croppedAreaPixels,
      200
    );
    setLogo(croppedImage);
    setCropping(false);
    setImageToCrop(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) showCropper(file);
  };

  if (cropping && imageToCrop) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-medium text-white">Crop your logo</h3>
        <div className="relative w-[300px] h-[300px] bg-black">
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => setCropping(false)}>Back</Button>
          <Button onClick={completeCrop}>Finish</Button>
        </div>
      </div>
    );
  }

  const addGradientColor = () => {
    setBg([...bg, "#000000"]);
  };

  const removeGradientColor = (index: number) => {
    if (bg.length > 1) {
      const updated = [...bg];
      updated.splice(index, 1);
      setBg(updated);
    }
  };

  const updateGradientColor = (index: number, color: string) => {
    const updated = [...bg];
    updated[index] = color;
    setBg(updated);
  };

  const renderGradientPreview = () => {
    const gradient = `linear-gradient(${bgDirection}, ${bg.join(
      ", "
    )})`;
    return (
      <div
        className="w-full h-24 rounded-md border border-zinc-700"
        style={{ background: gradient }}
      ></div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 text-light">
      <Header
        title="Customize Your Branding"
        subtitle="Upload your logo and choose how your login page looks."
      />
      <div className="flex w-full flex-row flex-wrap justify-center align-around gap-20">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />

        <div className="space-y-6 w-full max-w-md flex flex-col">
          <div className="flex flex-col gap-2">
            <span className="text-xl text-zinc-300">Organization Logo</span>

            <div className="relative w-[200px] h-[200px] border border-zinc-700 rounded-md flex items-center justify-center bg-zinc-800 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {logo ? (
                <>
                  <img
                    src={logo}
                    alt="Logo Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogo(null);
                    }}
                    className="absolute -top-2 -right-2 bg-black rounded-full p-[2px] hover:bg-zinc-700"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <span className="text-white text-4xl">+</span>
              )}
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <span className="text-xl text-zinc-300">Gradient Colors</span>
            <div className="flex flex-wrap gap-2">
              {bg.map((color, i) => (
                <div key={i} className="flex items-center gap-2 relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateGradientColor(i, e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-400"
                  />
                  {bg.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGradientColor(i)}
                      className="absolute -top-1 -right-1 bg-black rounded-full p-[2px] hover:bg-zinc-700"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGradientColor}
                className="w-8 h-8 rounded border border-zinc-400 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                +
              </button>
            </div>


            <div className="flex gap-2 mt-2">
              <label>
                <input
                  type="radio"
                  name="direction"
                  checked={bgDirection === "to right"}
                  onChange={() => setBgDirection("to right")}
                />{" "}
                Left to Right
              </label>
              <label>
                <input
                  type="radio"
                  name="direction"
                  checked={bgDirection === "to bottom"}
                  onChange={() => setBgDirection("to bottom")}
                />{" "}
                Top to Bottom
              </label>
            </div>
            {renderGradientPreview()}
          </div>

          <span className="text-sm text-zinc-400 italic">
            You can skip for now and update later.
          </span>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium text-white">
                Login Page Preview
              </h2>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-lg px-2 py-1 rounded text-white hover:bg-zinc-600"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>

            <div className="flex justify-center">
              <LoginPreview
                bgColors={bg}
                bgDirection={bgDirection}
                logo={logo}
                orgName={orgName}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalNavButtons className="max-w-[800px]">
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
