import { useState } from "react";

export default function Logo() {
  const [animate, setAnimate] = useState(false);

  const triggerAnimation = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
  };

  return (
    <div className="fixed top-4 left-4 z-50" style={{ perspective: "1000px" }}>
      <img
        src="/logo.png"
        alt="Logo"
        className={`h-35 w-auto drop-shadow-md rounded-xl ${
          animate ? "spin-y-once" : ""
        }`}
        onMouseEnter={triggerAnimation}
      />
    </div>
  );
}
