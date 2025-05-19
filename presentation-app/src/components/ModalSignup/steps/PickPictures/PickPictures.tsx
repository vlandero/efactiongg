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
}: PickPicturesParams) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const [cropping, setCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [backgroundMode, setBackgroundMode] = useState<"image" | "gradient">(
    "gradient"
  );
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [gradientColors, setGradientColors] = useState<string[]>(["#000000"]);
  const [gradientDirection, setGradientDirection] = useState<
    "to right" | "to bottom"
  >("to right");

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

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    setGradientColors([...gradientColors, "#000000"]);
  };

  const removeGradientColor = (index: number) => {
    if (gradientColors.length > 1) {
      const updated = [...gradientColors];
      updated.splice(index, 1);
      setGradientColors(updated);
    }
  };

  const updateGradientColor = (index: number, color: string) => {
    const updated = [...gradientColors];
    updated[index] = color;
    setGradientColors(updated);
  };

  const renderGradientPreview = () => {
    const gradient = `linear-gradient(${gradientDirection}, ${gradientColors.join(
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      <div className="space-y-6 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <span className="text-m text-zinc-300">Organization Logo</span>
          <div className="flex gap-2">
            <Button onClick={() => fileInputRef.current?.click()}>
              Upload Logo
            </Button>
            {logo && <Button onClick={() => setLogo(null)}>Remove</Button>}
          </div>

          {logo && (
            <img
              src={logo}
              alt="Logo Preview"
              className="w-[200px] h-[200px] object-cover rounded-md border border-zinc-700"
            />
          )}
        </div>

        {/* <div className="flex gap-4">
                    <Button onClick={() => setBackgroundMode('image')}>
                        Background Image
                    </Button>
                    <Button onClick={() => setBackgroundMode('gradient')}>
                        Gradient
                    </Button>
                </div> */}

        {backgroundMode === "image" ? (
          <div className="flex flex-col gap-2">
            <span className="text-m text-zinc-300">Background Image</span>
            <div className="flex gap-2">
              <Button onClick={() => bgInputRef.current?.click()}>
                Upload Background
              </Button>
              {bg && <Button onClick={() => setBg(null)}>Remove</Button>}
            </div>
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgImageUpload}
              className="hidden"
            />
            {bg && (
              <img
                src={bg}
                alt="Background preview"
                className="h-24 w-full object-cover rounded-md border border-zinc-700"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-m text-zinc-300">Gradient Colors</span>
            <div className="flex flex-wrap gap-2">
              {gradientColors.map((color, i) => (
                <div key={i} className="flex items-center gap-2 relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateGradientColor(i, e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-400"
                  />
                  {gradientColors.length > 1 && (
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
            </div>
            <Button
              onClick={addGradientColor}
              className="mt-2 bg-transparent text-blue-400 hover:text-blue-600 hover:underline"
            >
              + Add Color
            </Button>
            <div className="flex gap-2 mt-2">
              <label>
                <input
                  type="radio"
                  name="direction"
                  checked={gradientDirection === "to right"}
                  onChange={() => setGradientDirection("to right")}
                />{" "}
                Left to Right
              </label>
              <label>
                <input
                  type="radio"
                  name="direction"
                  checked={gradientDirection === "to bottom"}
                  onChange={() => setGradientDirection("to bottom")}
                />{" "}
                Top to Bottom
              </label>
            </div>
            {renderGradientPreview()}
          </div>
        )}

        <span className="text-sm text-zinc-400 italic">
          You can skip for now and update later.
        </span>
      </div>

      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-white">
              Login Page Preview
            </h2>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-0 right-0 mt-1 mr-1 text-lg px-2 py-1 rounded text-white hover:bg-zinc-600"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div className="flex justify-center">
            <LoginPreview
              bgColors={gradientColors}
              bgDirection={gradientDirection}
              logo={logo}
              orgName={orgName}
              theme={theme}
            />
          </div>
        </div>
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
